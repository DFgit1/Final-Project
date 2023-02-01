const Sequelize =  require('sequelize');
const config = require('../config');

const Review = config.define("Review", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    rating: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    message: {
        type: Sequelize.STRING,
        allowNull: true
    },  
    trail_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    // image: {
    //     type: Sequelize.STRING,
    //     allowNull: true
    // }  
}, {timestamps: false});

module.exports = Review;