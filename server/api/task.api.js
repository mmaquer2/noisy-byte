const { faker } = require('@faker-js/faker');
const task = require("../models/task");
const { trace } = require('@opentelemetry/api');
const logger = require('../config/logger');
const { context } = require('@opentelemetry/api');


/// ==================== HELPER FUNCTIONS =========================== ///

// function to invalidate cache of a specific user by user_id
async function invalidateCache(){
    const redisClient = req.app.locals.redisClient;
    await redisClient.del('tasks:all');
}

// function to validate task object before creating or updating a task
async function validateTask(task) {
    // TODO: implement validation logic
};

/// ===================  USER TASK CRUD FUNCTIONS ====================== ///

const getUserTask = async (req, res) => {
    const user_id = req.params.id;
    
    // Create a new span
    const tracer = trace.getTracer('users');
    const currentContext = context.active();
    
    // Start span with active context
    const span = tracer.startSpan('get-user-task', {}, currentContext);
    
    // Create new context with this span
    const contextWithSpan = trace.setSpan(currentContext, span);

    try {
        // Activate the new context for all operations within
        return await context.with(contextWithSpan, async () => {
            logger.info('Getting tasks for user', { 
                "user_id": user_id
            });

            // Add span attributes
            span.setAttributes({
                'user.id': user_id,
                'http.method': req.method,
                'http.url': req.url,
                'http.route': '/users/:id/tasks',
            });

            // Add Redis check event
            span.addEvent('checking_redis_cache');
            const redisClient = req.app.locals.redisClient;

            // TODO: remove this once auth is implemented
           // const cachedData = await redisClient.get(`tasks:user:${user_id}`);
            const cachedData = null;

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
                    'cache.hit': false
                });
                span.addEvent('cache_miss');
                span.addEvent('querying_database');

                const tasks = await task.findAll({
                    where: {
                        user_id: user_id
                    }
                });

                span.setAttributes({
                    'db.operation': 'findAll',
                    'db.table': 'tasks',
                    'result.count': tasks?.length || 0
                });

                if (tasks && tasks.length > 0) {
                    span.addEvent('updating_redis_cache');
                    await redisClient.set(
                        `tasks:user:${user_id}`, 
                        JSON.stringify(tasks), 
                        'EX', 
                        60
                    );
                    
                    span.setAttributes({
                        'response.status_code': 200,
                        'response.size': Buffer.from(JSON.stringify(tasks)).length
                    });
                    span.end();
                    return res.json(tasks);
                } else {
                    span.setAttributes({
                        'result.empty': true,
                        'response.status_code': 404
                    });
                    span.addEvent('no_tasks_found');
                    span.end();
                    return res.status(404).json({
                        message: `No tasks found for user id ${user_id}`
                    });
                }
            }
        });
    } catch (error) {
        span.setAttributes({
            'error': true,
            'error.type': error.name,
            'error.message': error.message,
            'response.status_code': 500
        });
        
        span.recordException(error);
        span.addEvent('error_occurred', {
            'error.type': error.name,
            'error.message': error.message
        });
        
        span.end();
        
        console.error('Error fetching tasks:', error);
        return res.status(500).json({ 
            error: error.message,
            message: `Failed to get all tasks for user id ${user_id}` 
        });
    }
};

const createUserTask = async (req, res) => {
    const { title, description, status, user_id } = req.body;
 
    logger.info('Creating new task', { 
       "title": title,
        "description": description,
        "status": status,
        "user_id": user_id
    });

    try {
        const span = trace.getTracer('task').startSpan('create-user-task');
        const uuid = faker.string.uuid();
        const newTask = await task.create({
            title,          
            description,
            status,
            uuid,
            user_id
        });

        res.json(newTask);
        span.setAttribute({ 
                            'createdby_user': user_id,
                            'task_id': newTask.id,
                            'title': newTask.title,
                            'description': newTask.description,
                            'status': newTask.status,
                            'uuid': newTask.uuid
        });
        span.end();
        
        // Handle cache invalidation after response
        try {
            const redisClient = req.app.locals.redisClient;
            await redisClient.del(`tasks:user:${user_id}`);
            console.log("Cache invalidated successfully");
        } catch (redisError) {
            console.error("Failed to invalidate cache:", redisError);
        }

        logger.info('Task created successfully', {  
            "task_id": newTask.id,
            "title": newTask.title,
            "description": newTask.description,
            "status": newTask.status,
            "uuid": newTask.uuid
        });
        
        // TODO: send a websocket response to the client, notifying that the task has been created
        
    } catch(error) {
        res.status(500).json({ 
            error: error.message,
            message: "Failed to create task" 
        });
    }
}

const updateUserTask = async (req, res) => { 

    const { title, description, status , uuid } = req.body;
    const { id } = req.params;

    logger.info('Updating task', {  
        "task_id": id,
        "title": title,
        "description": description,
        "status": status,
        "uuid": uuid
    });

    try {
        
        const span = trace.getTracer('task').startSpan('update-user-task');
        
        // TODO: validate the request body and params

        const updatedTask = task.update({
            title: title,
            description: description,
            status: status,
            uuid: uuid
        }, {
            where: {
                id: id
            }
        });
        
         // TODO: send a response to the client, notifying that the task has been updated
    
        res.json(updatedTask);
        span.end();

        logger.info('Task updated successfully', {
            "task_id": id,
            "title": title,
            "description": description,
            "status": status,
            "uuid": uuid
        });

        // TODO: Handle cache invalidation after response

       
    } catch (error) {
        console.error('Error updating task:', error);
        logger.error('Error updating task', {
            "task_id": id,
            "error": error.message
        });
        span.recordException(error);
        span.end();
        return res.status(500).json({ 
            error: error.message,
            message: "Failed to update task" 
        });
    }
};

const deleteUserTask = async (req, res) => { 
    const { id } = req.params;

    logger.info('Deleting task', {
        "task_id": id
    });
    
    const span = trace.getTracer('task').startSpan('delete-user-task');
    
    try {
        const deletedTasked = task.destroy({
            where: {
                id: id
            }
        });

        res.json(deletedTasked);
        
        //TODO: send a response to the client, notifying that the task has been deleted

        // Handle cache invalidation after response
        try {
            const redisClient = req.app.locals.redisClient;

            // TODO: get user_id from task object or auth session
        
        //    await redisClient.del(`tasks:user:${user_id}`);
        //    console.log("Cache invalidated successfully");
        
        } catch (redisError) {
            console.error("Failed to invalidate cache after deletion", redisError);
        }

        logger.info('Task deleted successfully', {  
            "task_id": id
            //,'user_id': user_id
        });

        
        span.setAttribute({ 'task_id': id
                            //,'user_id': user_id   
         });
        span.addEvent('invoking delete task');
        span.end();

       
    } catch (error) {
        console.error('Error deleting task:', error);
        logger.error('Error deleting task', {
            "task_id": id,
            "error": error.message
        });
        span.recordException(error);
        span.end();
        return res.status(500).json({ 
            error: error.message,
            message: "Failed to delete task" 
        });
    }
}


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