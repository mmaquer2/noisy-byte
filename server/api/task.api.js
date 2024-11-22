const { faker } = require('@faker-js/faker');
const task = require("../models/task");
const { trace } = require('@opentelemetry/api');
const logger = require('../config/logger');


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

const getUserTask = async (req,res ) => {
    const user_id = req.params.id;
    
    try {

        logger.info('Getting tasks for user', { 
             "user_id": user_id
         });

        const span = trace.getTracer('users').startSpan('get-user-task');
        const redisClient = req.app.locals.redisClient;
        const cachedData = await redisClient.get(`tasks:user:${user_id}`);

        if(cachedData) {
            return res.json(JSON.parse(cachedData));
        } else {
            const tasks = await task.findAll({
                where: {
                    user_id: user_id
                }
            });
            await redisClient.set(`tasks:user:${user_id}`, JSON.stringify(tasks), 'EX', 60);
            span.end();
            if (!tasks) {
                return res.status(404).json({
                    message: `No tasks found for user id ${user_id}`
                });
            }
            return res.json(tasks);
        }

    } catch (error) {
        console.error('Error fetching tasks:', error);
        span.recordException(error);
        span.end();
        return res.status(500).json({ 
            error: error.message,
            message: `Failed to get all tasks for user id ${user_id}` 
        });
    }
}

const createUserTask = async (req, res) => {
    const { title, description, status, user_id } = req.body;
 
    logger.info('Creating new task', { 
       "title": title,
        "description": description,
        "status": status,
        "user_id": user_id
    });

    try {
        const span = trace.getTracer('users').startSpan('create-user-task');
        const uuid = faker.string.uuid();
        const newTask = await task.create({
            title,          
            description,
            status,
            uuid,
            user_id
        });

        res.json(newTask);
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
        
        // TODO: send a response to the client, notifying that the task has been created
        

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
        
        const span = trace.getTracer('users').startSpan('update-user-task');
        
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
    
    const span = trace.getTracer('users').startSpan('delete-user-task');
    
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
            //'user_id': user_id
        });

        
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
    console.log("GET ALL TASKS /api/get-task api called");
    
    if (res.headersSent) {
        console.warn('Response was already sent');
        return;
    }

    try {

        const span = trace.getTracer('users').startSpan('get-all-users');
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
    try {

        const randomTask = faker.commerce.productName();
        const randomDescription = faker.lorem.sentence();
        const uuid = faker.string.uuid();
        const status = "pending";

        const span = trace.getTracer('users').startSpan('get-user-task');
        
        const newTask = await task.create({
            title: randomTask,          
            description: randomDescription,
            status: status,
            uuid: uuid,
            user_id: 1
        });
        
        res.json(newTask);
        console.log("new random task created successfully");
        const redisClient = req.app.locals.redisClient;
        await redisClient.del('tasks:all');
        span.end();

    } catch (error) {
        res.status(500).json({ 
            error: error.message,
            message: "Failed to create task" 
        });
    }
}

module.exports = {
    createUserTask,
    deleteUserTask,
    updateUserTask,
    getUserTask,
    createRandomTask,
    getAllTasks,   
}