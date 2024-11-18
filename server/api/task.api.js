const { faker } = require('@faker-js/faker');
const task = require("../models/task");

const getAllTasks = async (req, res) => {
    console.log("GET ALL TASKS /api/get-task api called");
    try {
        const tasks = await task.findAll();
        res.json(tasks);
    } catch (error){
        res.status(500).json({ 
            error: error.message,
            message: "Failed to get all tasks" 
        });
    }

}

const createTask = async (req, res) => {
    const { name, description, status } = req.body;

    try {

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
    } catch (error) {
        res.status(500).json({ 
            error: error.message,
            message: "Failed to create task" 
        });
    }
}

const updateTask = async (req, res) => {
    const { title, description, status , uuid } = req.body;
    const { id } = req.params;
    //const task = await task.findByIdAndUpdate   

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