const { faker } = require('@faker-js/faker');
const task = require("../models/task");
const { trace } = require('@opentelemetry/api');

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

            // cache the data
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


const createTask = async (req, res) => {
    const { name, description, status } = req.body;
    try {
        
        // TODO: Validate the request body

        // TODO: invalidate the cache for all tasks

        const newTask = await task.create({
            title: name,          
            description: description,
            status: status,
        });
        
        res.json(newTask);

    } catch {
        res.status(500).json({ 
            error: error.message,
            message: "Failed to create task" 
        });
    }
       
}

const createRandomTask = async (req, res) => {
    try {

        const randomTask = faker.commerce.productName();
        const randomDescription = faker.lorem.sentence();
        const uuid = faker.string.uuid();
        const status = "pending";
        
        const newTask = await task.create({
            title: randomTask,          
            description: randomDescription,
            status: status,
            uuid: uuid,
        });
        
        res.json(newTask);

        // invalidate the cache for all tasks
        const redisClient = req.app.locals.redisClient;
        await redisClient.del('tasks:all');

    } catch (error) {
        res.status(500).json({ 
            error: error.message,
            message: "Failed to create task" 
        });
    }
}

const updateTask = async (req, res) => {
    const { title, description, status , uuid } = req.body;
    

}

const deleteTask = async (req, res) => {
    const { id } = req.params;

    res.json(task);
}

module.exports = {
    createTask,
    createRandomTask,
    updateTask,
    deleteTask,
    getAllTasks
}