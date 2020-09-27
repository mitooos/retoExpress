const { Sequelize } = require("sequelize");

module.exports.sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "data/db.sqlite",
});
