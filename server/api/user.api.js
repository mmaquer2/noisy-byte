const { faker } = require('@faker-js/faker');
const user = require("../models/user");

const createRandomUser = async (req, res) => {
    console.log("Creating random user");
    try {
        const randomName = faker.internet.displayName();
        const randomPassword = faker.internet.password();
        const randomEmail = faker.internet.email();
        const randomAvatar = faker.image.avatar();
        const newUser = await user.create({ username: randomName, password: randomPassword, email: randomEmail, avatar: randomAvatar });
        console.log("Random user created");
        res.json(newUser);    
    } 
    catch (error) {
            res.status(500).json({ 
                error: error.message,
                message: "Failed to create user" 
            });
    }
}


const getAllUsers = async (req, res) => {
    try {
        const users = await user.findAll();
        if (!users) {
            return res.status(404).json({
                message: "No users found"
            });
        }
        return res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).json({ 
            error: error.message,
            message: "Failed to get all users" 
        });
    }
}

module.exports = {
    createRandomUser,
    getAllUsers
}