const { DataTypes } = require("sequelize");
const { database } = require("../01-utils/database");
const User = require("./user.model");

const Token = database.define(
  "Token",
  {
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "user_id",
      },
      primaryKey: true,
      allowNull: false,
    },
    refresh_token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Token;
