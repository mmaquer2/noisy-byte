const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const user = require('../models/user');
const v4 = require('uuid') 
const logger = require('../config/logger');



const registerNewUser = async (req, res) => {
    try {
        
        // TODO: confirm that the request body contains the required fields
        //const { username, password, email } = req.body;

        // for testing only
        const username = "test";
        const password = "Test12345!@";
        const email = "hello@gmail.com";

        // Validate input
        if (!username || !password || !email) {
            logger.warn('Invalid user creation attempt - missing fields');
            return res.status(400).json({ 
                message: 'Username, password, and email are required' 
            });
        }

        // Check if user exists
        const existingUser = await user.findOne({ 
            where: { 
                [Op.or]: [
                    { username },
                    { email }
                ]
            }
        });

        if (existingUser) {
            logger.warn('User creation failed - duplicate user', { username, email });
            return res.status(400).json({ 
                message: 'Username or email already exists' 
            });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        //const newUser = await user.create({ username: randomName, password: randomPassword, email: randomEmail, avatar: randomAvatar });

        // Create user
        const newUser = await user.create({
            username,
            email,
            password: hashedPassword,
            uuid: v4() // Unique identifier for user
        });

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: newUser.id, 
                username: newUser.username 
            },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        logger.info('User created successfully', { 
            userId: newUser.id,
            username: newUser.username 
        });

        // Return user data (exclude password)
        res.status(201).json({
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                uuid: newUser.uuid
            },
            token
        });

    } catch (error) {
        logger.error('User creation failed', { 
            error: error.message,
            stack: error.stack 
        });
        res.status(500).json({ 
            message: 'Failed to create user' 
        });
    }
};

// Password validation middleware (optional)
const validatePassword = (req, res, next) => {
    const { password } = req.body;

    // Password requirements
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (
        password.length < minLength ||
        !hasUpperCase ||
        !hasLowerCase ||
        !hasNumbers ||
        !hasSpecialChar
    ) {
        return res.status(400).json({
            message: 'Password must be at least 8 characters and contain uppercase, lowercase, numbers, and special characters'
        });
    }

    next();
};


const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user
        const user = await user.findOne({ where: { username } });
        if (!user) {
            logger.warn('Login attempt with non-existent user', { username });
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            logger.warn('Invalid password attempt', { username });
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign(
            { 
                id: user.id, 
                username: user.username 
            },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        logger.info('User logged in successfully', { userId: user.id });

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username
            }
        });

    } catch (error) {
        logger.error('Login error', { error: error.message });
        res.status(500).json({ message: 'Login failed' });
    }
};

async function logout(req, res) {
    try {
        // TODO: Implement logout functionality

    } catch (error) {
        logger.error('Logout error', { error: error.message });
        res.status(500).json({ message: 'Logout failed' });
    }
}


module.exports = {
    registerNewUser,
    validatePassword,
    logout,
    login
}