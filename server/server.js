require('./instrumentation.js'); 
require('dotenv').config();
const express = require("express");
const cors = require('cors');
const { createClient } = require("redis");  
const db = require('./config/db');

console.log("STARTING NOISY BYTE IN " + process.env.NODE_ENV + " MODE");

const PORT = process.env.PORT || 3000;

const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', err => console.log('Redis Client Error', err));
redisClient.on('connect', () => console.log('Redis Client Connected'));

const startServer = async () => {
    try {
        await redisClient.connect();
        
        const app = express();
        app.use(express.json());
        app.use(cors());

        app.locals.redisClient = redisClient;

        app.get("/", (req, res) => {
            res.send("Hello World From Noisy-Byte!");
        });

        app.use("/api/task", require("./routes/task-route"));
        app.use("/api/user", require("./routes/user-route"));
        app.use("/api/random", require("./routes/random-route"));

        await db.sync({ alter: true });
        
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Error during startup:', err);
        process.exit(1);
    }
};

startServer();

process.on('SIGTERM', async () => {
    console.log('Shutting down...');
    await redisClient.quit();
    process.exit(0);
});