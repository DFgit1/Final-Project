const Sequelize =  require('sequelize');
const config = require('../config');

const Favourite = config.define("Favourite", {
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
   
    trail_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
 
}, {timestamps: false});

module.exports = Favourite;