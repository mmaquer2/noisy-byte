const router = require("express").Router();
const taskApi = require("../api/task.api");

router.get("/get-task", (req, res) => {
    console.log("GET /api/create-task called");
    res.json({ message: "GET /api/create-task called" });
});


router.post("/create-task", (req, res) => {
    console.log("POST /api/create-task called");
    res.json({ message: "POST /api/create-task called" });
});


module.exports = router;