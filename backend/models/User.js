const Sequelize =  require('sequelize');
const config = require('../config');

const User = config.define("User", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    userName: {
        type: Sequelize.STRING,
        allowNull: false
    },  
    image: {
        type: Sequelize.STRING,
        allowNull: false
    }  
}, {timestamps: false});

module.exports = User;