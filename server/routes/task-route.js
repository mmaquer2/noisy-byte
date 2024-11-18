const router = require("express").Router();
const { getAllTasks, createRandomTask, createTask } = require("../api/task.api");

router.get("/get-all", getAllTasks); 

router.get("/create-task", createTask);

router.get("/random", async (req, res) => {
    try {
        console.log("GET /api/task/random called");
        const randomTask = await createRandomTask(req, res);
        res.json(randomTask);
    } catch (error) {
        res.status(500).json({ 
            error: error.message,
            message: "Failed to create random task" 
        });
    }
});


module.exports = router;