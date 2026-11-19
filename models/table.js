const Sequelize = require("sequelize");
const sequelize = require("./db-connection");

const Table = sequelize.define("table", {
  tableName: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  columns: {
    type: Sequelize.JSON,
    allowNull: false,
  },
});

module.exports = Table;
