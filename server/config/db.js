const { Sequelize } = require('sequelize');

const db = new Sequelize({
    dialect: 'sqlite',
    storage: '../db/database.sqlite', 
    logging: console.log
});

module.exports = db;