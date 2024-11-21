const { faker } = require('@faker-js/faker');
const task = require("../models/task");
const { trace } = require('@opentelemetry/api');
const logger = require('../config/logger');


async function invalidateCache(){
    const redisClient = req.app.locals.redisClient;
    await redisClient.del('tasks:all');
}


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

        console.log("new task created successfully");
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
        
        res.json(updatedTask);
        span.end();

        // TODO: send a response to the client, notifying that the task has been updated
    
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
        span.end();

        //TODO: send a response to the client, notifying that the task has been deleted

        // Handle cache invalidation after response
        try {
            const redisClient = req.app.locals.redisClient;
            await redisClient.del(`tasks:user:${user_id}`);
            console.log("Cache invalidated successfully");
        } catch (redisError) {
            console.error("Failed to invalidate cache after deletion", redisError);
        }

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