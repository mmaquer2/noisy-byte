const express = require("express");
const cors = require('cors');
const db = require('./config/db');

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("Hello World From Noisy-Byte!");
});

app.use("/api/task", require("./routes/task-route"));
app.use("/api/user", require("./routes/user-route"));
app.use("/api/random", require("./routes/random-route"));

db.sync({ alter: true }) // To update the database schema for the model
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });