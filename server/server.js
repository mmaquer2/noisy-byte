const express = require("express");
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World From Noisy-Byte!");
});

app.use("/api/task", require("./routes/task-route"));
app.use("/random", require("./routes/random-route"));
//app.use("api/user", require("./routes/user-route"));

app.listen(3000, () => {
    console.log(`Server is running on port ${PORT}`);
});