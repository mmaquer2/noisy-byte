const router = require("express").Router();
const { getAllTasks, createRandomTask } = require("../api/task.api");

router.get("/get-all", (req, res) => {
    try {

        console.log("GET /api/create-task route called");
        const data = getAllTasks(req, res);
        res.json(data);

    } catch (error){
        res.status(500).json({ 
            error: error.message,
            message: "Failed to get all tasks" 
        });
    }
    
});

router.get("/create-task", (req, res) => {
    console.log("POST /api/create-task called");
    res.json({ message: "POST /api/create-task called" });
});

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