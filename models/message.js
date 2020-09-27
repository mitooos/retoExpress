const { DataTypes } = require("sequelize");
const { sequelize } = require("../lib/sequelize");

const Message = sequelize.define("Message", {
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ts: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports.Message = Message;
