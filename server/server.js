require('./config/instrumentation.js'); 
require('dotenv').config();
const { metrics } = require('@opentelemetry/api');
const express = require("express");
const cors = require('cors');
const { createClient } = require("redis");  
const db = require('./config/db');
const logger = require('./config/logger');

const meter = metrics.getMeter('requests');
const requestCounter = meter.createCounter('http_requests_total');
const responseTimeHistogram = meter.createHistogram('http_response_time_seconds');


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

        app.use((req, res, next) => {
            logger.info(`${req.method} ${req.path}`);
            next();
        });

        // Middleware to track requests and response time
        // app.use((req, res, next) => {
        //     const startTime = Date.now();

        //     // Count request
        //     requestCounter.add(1, {
        //         path: req.path,
        //         method: req.method
        //     });

        //     // Track response time
        //     res.on('finish', () => {
        //         const duration = (Date.now() - startTime) / 1000; // Convert to seconds
        //         responseTimeHistogram.record(duration, {
        //             path: req.path,
        //             method: req.method,
        //             status_code: res.statusCode.toString()
        //         });
        //     });

        //     next();
        // });

        app.locals.redisClient = redisClient;

        app.get("/", (req, res) => {
            res.send("Hello World From Noisy-Byte!");
        });

        app.use("/api/auth", require("./routes/auth-route"));
        app.use("/api/task", require("./routes/task-route"));
        app.use("/api/user", require("./routes/user-route"));
        app.use("/api/random", require("./routes/random-route"));

        await db.sync({ alter: true });
        
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log("Noisy Byte is ready to make some noise! :music:");
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