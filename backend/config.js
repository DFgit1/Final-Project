const Sequelize = require("sequelize");
const config = new Sequelize("hykadoo", "root", "buckster12", {dialect: "mariadb"});

module.exports = config;