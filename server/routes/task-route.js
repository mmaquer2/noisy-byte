const router = require("express").Router();
const { getAllTasks, createRandomTask, createTask } = require("../api/task.api");

router.get("/get-all", getAllTasks); 
router.get("/create-task", createTask);
router.get("/random", createRandomTask);

module.exports = router;