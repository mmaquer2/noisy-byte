const router = require("express").Router();
const { getAllTasks, createRandomTask, createUserTask, getUserTask, deleteUserTask, updateUserTask } = require("../api/task.api");

router.get("/get/all", getAllTasks);
router.get("/create/random", createRandomTask);

router.get("/get/:id", getUserTask); 
router.post("/create/:id", createUserTask);
router.delete("/delete/:id", deleteUserTask);
router.put("/update/:id", updateUserTask);

module.exports = router;