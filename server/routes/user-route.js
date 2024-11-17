const router = require("express").Router();
const { createTask, createRandomTask } = require("../api/task.api");

router.post("/task", createTask);
router.post("/task/random", createRandomTask);

exports.router = router;