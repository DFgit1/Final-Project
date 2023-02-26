const Sequelize = require("sequelize");
const config = require("./../config");

const Hike = config.define("Hike", {
id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
},
park_name: {
    type: Sequelize.STRING,
    allowNull: false
},
trail_name: {
    type: Sequelize.STRING,
    allowNull: false
},
image: {
    type: Sequelize.STRING,
    allowNull: true
},
distance: {
    type: Sequelize.INTEGER,
    allowNull: false
},
duration: {
    type: Sequelize.INTEGER,
    allowNull: false
},
difficulty: {
    type: Sequelize.STRING,
    allowNull: false
},
description: {
    type: Sequelize.STRING,
    allowNull: false
},


}, {timestamps: false});



module.exports = Hike;