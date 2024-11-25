const router = require("express").Router();
const { getAllTasks, createRandomTask, createUserTask, getUserTask, deleteUserTask, updateUserTask } = require("../api/task.api");
const {authMiddleware} = require("../api/auth.api");

router.get("/get/all", getAllTasks);
router.get("/create/random", createRandomTask);

// Protected routes
router.get('/get', authMiddleware, getUserTask);
router.post("/create", authMiddleware, createUserTask);
router.delete("/delete", deleteUserTask);
router.put("/update/:id", updateUserTask);

module.exports = router;