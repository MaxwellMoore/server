const { DataTypes } = require("sequelize");
const config = require("../../config/default");
const { database } = require("../01-utils/database");

const User = database.define(
  "User",
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    picture: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

// TODO: Implement beforeCreate and before Update hooks to hash password before being stored

// Methods
User.prototype.comparePassword = function (password) {
  if (password != this.password) {
    return false;
  } else {
    return true;
  }
};

// Associations
//User.hasMany(require("./session.model"), { foreignKey: user_id });

module.exports = User;
