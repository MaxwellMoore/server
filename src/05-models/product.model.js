const { DataTypes } = require("sequelize");
const { database } = require("../01-utils/database");
const User = require("./user.model");

const Product = database.define(
  "Product",
  {
    product_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "user_id",
      },
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "title",
    },
    company: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "company",
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "status",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Product;
