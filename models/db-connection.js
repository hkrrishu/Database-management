const Sequelize = require('sequelize');

const sequelize = new Sequelize('database_management', 'root', 'Rishu@123', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;