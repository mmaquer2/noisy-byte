const { faker } = require('@faker-js/faker');
const task = require("../models/task");
const { trace } = require('@opentelemetry/api');
const logger = require('../config/logger');
const { context } = require('@opentelemetry/api');

/// ===================  USER TASK CRUD FUNCTIONS ====================== ///

const getUserTask = async (req, res) => {

    logger.info('get user tasks called');
    const tracer = trace.getTracer('users');
    const currentContext = context.active();
    const span = tracer.startSpan('get-user-task', {}, currentContext);
    const contextWithSpan = trace.setSpan(currentContext, span);

    try {
        // Extract user_id from the request (set by auth middleware)
        const user_id = req.user.id;

        logger.info('Getting tasks for user', { "user_id": user_id });

        // Add span attributes
        span.setAttributes({
            'user.id': user_id,
            'http.method': req.method,
            'http.url': req.url,
            'http.route': '/users/:id/tasks',
        });


        const redisClient = req.app.locals.redisClient;

        span.addEvent('checking_redis_cache');
        const cachedData = await redisClient.get(`tasks:user:${user_id}`);

        if (cachedData) {
            span.setAttributes({
                'cache.hit': true,
                'cache.key': `tasks:user:${user_id}`,
                'data.size': Buffer.from(cachedData).length,
            });
            span.addEvent('cache_hit');
            span.end();
            return res.json(JSON.parse(cachedData));
        } else {
            span.setAttributes({
                'cache.hit': false,
            });
            span.addEvent('cache_miss');
            span.addEvent('querying_database');

            // Fetch tasks from database
            const tasks = await task.findAll({
                where: {
                    user_id: user_id,
                },
            });

            span.setAttributes({
                'db.operation': 'findAll',
                'db.table': 'tasks',
                'result.count': tasks?.length || 0,
            });

            // handle when the user has tasks in the database
            if (tasks && tasks.length > 0) {
                // Update Redis cache
                span.addEvent('updating_redis_cache');
                await redisClient.set(
                    `tasks:user:${user_id}`,
                    JSON.stringify(tasks),
                    'EX',
                    60
                );
                span.setAttributes({
                    'response.status_code': 200,
                    'response.size': Buffer.from(JSON.stringify(tasks)).length,
                });
                span.end(); 
                return res.json(tasks);


            } else {

                // handle when the user has no tasks in the database
                logger.info(`No tasks found for user ${user_id}`, { "user_id": user_id });
                span.setAttributes({
                    'result.empty': true,
                    'response.status_code': 404,
                });
                span.addEvent('no_tasks_found');
                span.end();

                res.json([]);

              
            }
        }
    } catch (error) {
        span.setAttributes({
            'error': true,
            'error.type': error.name,
            'error.message': error.message,
            'response.status_code': 500,
        });

        span.recordException(error);
        span.addEvent('error_occurred', {
            'error.type': error.name,
            'error.message': error.message,
        });

        span.end();

        console.error('Error fetching tasks:', error);
        return res.status(500).json({
            error: error.message,
            message: 'Failed to get tasks for the user',
        });
    }
};


const createUserTask = async (req, res) => {
    // Extract user_id from the authenticated request (set by authMiddleware)
    const user_id = req.user.id;

    // Extract task details from the request body
    const { title, description, status } = req.body;

    logger.info('Creating new task', { 
        title,
        description,
        status,
        user_id,
    });

    try {
        // Start a tracing span
        const span = trace.getTracer('task').startSpan('create-user-task');
        const uuid = faker.string.uuid(); // Generate unique identifier for the task
        const defaultStatus = "pending";

        // Create the task in the database
        const newTask = await task.create({
            title,
            description,
            defaultStatus,
            uuid,
            user_id,
        });

        // Respond to the client
        res.json(newTask);

        // Add attributes to the tracing span
        span.setAttributes({ 
            'createdby_user': user_id,
            'task_id': newTask.id,
            'title': newTask.title,
            'description': newTask.description,
            'status': newTask.status,
            'uuid': newTask.uuid,
        });
        span.end();

        // Handle cache invalidation after responding
        try {
            const redisClient = req.app.locals.redisClient;
            await redisClient.del(`tasks:user:${user_id}`);
            console.log("Cache invalidated successfully");
        } catch (redisError) {
            console.error("Failed to invalidate cache:", redisError);
        }

        // Log successful creation
        logger.info('Task created successfully', {  
            task_id: newTask.id,
            title: newTask.title,
            description: newTask.description,
            status: newTask.status,
            uuid: newTask.uuid,
        });

        // TODO: Send a WebSocket response to notify the client that the task has been created
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ 
            error: error.message,
            message: "Failed to create task",
        });
    }
};


const updateUserTask = async (req, res) => {
    const { title, description, status, uuid } = req.body;
    const { id } = req.params;
    const user_id = req.user.id; // Extracted from authMiddleware

    logger.info( `Updating task of task id: ${id} -  ${description} -  ${status}`, {
        task_id: id,
        title,
        description,
        status,
        uuid,
        user_id,
    });

    try {
        const span = trace.getTracer('task').startSpan('update-user-task');

        // Validate that the task belongs to the authenticated user
        const existingTask = await task.findOne({ where: { id, user_id } });
        if (!existingTask) {
            span.end();
            return res.status(403).json({ message: 'You are not authorized to update this task' });
        }

        // Update the task
        const updatedTask = await task.update(
            { title, description, status, uuid },
            { where: { id } }
        );

        res.json(updatedTask);
        span.end();

        logger.info('Task updated successfully', {
            task_id: id,
            title,
            description,
            status,
            uuid,
            user_id,
        });

        logger.info(`task  ${description} is now set to status - ${status}`);

        // Invalidate cache for the user
        try {
            const redisClient = req.app.locals.redisClient;
            await redisClient.del(`tasks:user:${user_id}`);
            console.log("Cache invalidated successfully");
        } catch (redisError) {
            console.error("Failed to invalidate cache after update", redisError);
        }
    } catch (error) {
        console.error('Error updating task:', error);
        logger.error('Error updating task', {
            task_id: id,
            error: error.message,
        });
        span.recordException(error);
        span.end();
        return res.status(500).json({
            error: error.message,
            message: "Failed to update task",
        });
    }
};

const deleteUserTask = async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id; // Extracted from authMiddleware

    logger.info('Deleting task', {
        task_id: id,
        user_id,
    });

    const span = trace.getTracer('task').startSpan('delete-user-task');

    try {
        // Validate that the task belongs to the authenticated user
        const existingTask = await task.findOne({ where: { id, user_id } });
        if (!existingTask) {
            span.end();
            return res.status(403).json({ message: 'You are not authorized to delete this task' });
        }

        // Delete the task
        const deletedCount = await task.destroy({ where: { id, user_id } });
        if (deletedCount === 0) {
            span.end();
            return res.status(404).json({ message: 'Task not found' });
        }

        // Send success response
        res.status(200).json({ message: 'Task deleted successfully', task_id: id });

        logger.info('Task deleted successfully', {
            task_id: id,
            user_id,
        });

        // Invalidate cache for the user
        try {
            const redisClient = req.app.locals.redisClient;
            await redisClient.del(`tasks:user:${user_id}`);
            console.log("Cache invalidated successfully");
        } catch (redisError) {
            console.error("Failed to invalidate cache after deletion", redisError);
        }

        span.setAttributes({ task_id: id, user_id });
        span.addEvent('Task deletion completed');
        span.end();

    } catch (error) {
        console.error('Error deleting task:', error);
        logger.error('Error deleting task', {
            task_id: id,
            error: error.message,
        });
        span.recordException(error);
        span.end();
        return res.status(500).json({
            error: error.message,
            message: "Failed to delete task",
        });
    }
};





/// ========================================================================== ///
/////////// ==================  WILDCARD FUNCTIONS ================== ///////////

const getAllTasks = async (req, res) => {
    const tracer = trace.getTracer('tasks');
    const currentContext = context.active();
    const span = tracer.startSpan('get-all-tasks', {}, currentContext);
    const contextWithSpan = trace.setSpan(currentContext, span);
    
    if (res.headersSent) {
        console.warn('Response was already sent');
        return;
    }

    try {

        const span = trace.getTracer('tasks').startSpan('get-all-tasks');
        const redisClient = req.app.locals.redisClient;
        const cachedData = await redisClient.get('tasks:all');

        if(cachedData) {
            console.log('Returning cached data for all tasks');
            return res.json(JSON.parse(cachedData));
        
        
        } else {
            
            console.log('No cached data found');
            const tasks = await task.findAll();
            await redisClient.set('tasks:all', JSON.stringify(tasks), 'EX', 60);
            span.end();
        
            if (!tasks) {
                return res.status(404).json({
                    message: "No tasks found"
                });
            }
    
            return res.json(tasks);

        }

    } catch (error){
        console.error('Error fetching tasks:', error);
        span.recordException(error);
        span.end();
        return res.status(500).json({ 
            error: error.message,
            message: "Failed to get all tasks" 
        });
    }
}


const createRandomTask = async (req, res) => {
    const tracer = trace.getTracer('tasks');
    const currentContext = context.active();
    const span = tracer.startSpan('create-random-task', {}, currentContext);
    const contextWithSpan = trace.setSpan(currentContext, span);

    try {
        return await context.with(contextWithSpan, async () => {
            // Record task generation event
            span.addEvent('generating_random_task');
            const randomTask = faker.commerce.productName();
            const randomDescription = faker.lorem.sentence();
            const uuid = faker.string.uuid();
            const status = "pending";

            // Add task details as attributes
            span.setAttributes({
                'task.title': randomTask,
                'task.uuid': uuid,
                'task.status': status,
                'task.user_id': 1,
                'task.description_length': randomDescription.length
            });

            // Record database operation event
            span.addEvent('creating_task_in_database');
            const newTask = await task.create({
                title: randomTask,          
                description: randomDescription,
                status: status,
                uuid: uuid,
                user_id: 1
            });

            // Record successful creation
            span.setAttributes({
                'db.operation': 'create',
                'db.table': 'tasks',
                'task.id': newTask.id,
                'response.status_code': 200
            });

            // Record cache clearing event
            span.addEvent('clearing_redis_cache');
            const redisClient = req.app.locals.redisClient;
            await redisClient.del('tasks:all');
            
            span.addEvent('operation_completed', {
                'task.id': newTask.id,
                'timestamp': Date.now()
            });

            span.end();
            console.log("new random task created successfully");
            return res.json(newTask);
        });

    } catch (error) {
        // Record error details
        span.setAttributes({
            'error': true,
            'error.type': error.name,
            'error.message': error.message,
            'response.status_code': 500
        });

        span.recordException(error);
        span.addEvent('error_occurred', {
            'error.type': error.name,
            'error.message': error.message,
            'timestamp': Date.now()
        });

        span.end();
        
        return res.status(500).json({ 
            error: error.message,
            message: "Failed to create task" 
        });
    }
};

module.exports = {
    createUserTask,
    deleteUserTask,
    updateUserTask,
    getUserTask,
    createRandomTask,
    getAllTasks,   
}