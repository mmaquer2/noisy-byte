const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const logger = require('../config/logger');
const user = require('../models/user');

const register = async (req, res) => {
    try {
        const { username, password, email, avatar } = req.body;

        // Check for missing fields
        if (!username || !password || !email) {
            logger.warn('Registration attempt with missing fields');
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = await user.create({
            username,
            email,
            password: hashedPassword,
            avatar: avatar || null,
            uuid: uuidv4()
        });

        logger.info('User registered successfully', { userId: newUser.id });

        res.status(201).json({
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                uuid: newUser.uuid
            }
        });

    } catch (error) {
        logger.error('Registration error', { error: error.message });
        res.status(500).json({ message: 'Registration failed' });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const redisClient = req.app.locals.redisClient;

        // Find user
        const foundUser = await user.findOne({ 
            where: { username },
            attributes: ['id', 'username', 'password', 'avatar']
        });

        if (!foundUser || !await bcrypt.compare(password, foundUser.password)) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate access token
        const accessToken = jwt.sign(
            { 
                id: foundUser.id,
                username: foundUser.username
            },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        // Store session in Redis
        await redisClient.set(
            `session:${foundUser.id}`,
            JSON.stringify({
                userId: foundUser.id,
                username: foundUser.username
            }),
            'EX',
            24 * 60 * 60 // 24 hours
        );

        logger.info('User logged in', { userId: foundUser.id });

        res.json({
            token: accessToken,
            user: {
                username: foundUser.username,
                avatar: foundUser.avatar
            }
        });

    } catch (error) {
        logger.error('Login error', { error: error.message });
        console.log(error);
        res.status(500).json({ message: 'Login failed' });
    }
};

const logout = async (req, res) => {
    try {
        const redisClient = req.app.locals.redisClient;
        const authHeader = req.headers.authorization;
        
        if (authHeader?.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
            
            // Remove session from Redis
            await redisClient.del(`session:${decoded.id}`);
        }

        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        logger.error('Logout error', { error: error.message });
        res.status(500).json({ message: 'Logout failed' });
    }
};


const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({ message: 'Authorization header missing' });
        }

        const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"
        if (!token) {
            return res.status(401).json({ message: 'Token missing in Authorization header' });
        }

        // Verify and decode token
        const decoded = jwt.verify(token, 'your-secret-key'); // TODO: Replace with process.env.JWT_SECRE
        req.user = { id: decoded.id }; // Attach user ID to the request object
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};


module.exports = {
    register,
    login,
    logout,
    authMiddleware
};