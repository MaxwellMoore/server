const { Sequelize, Op } = require("sequelize");
const axios = require("axios");
const Product = require("../05-models/product.model");
const logger = require("../01-utils/logger");

const createProduct = async (payload) => {
  return Product.create(payload);
};

const getProduct = async (queryCondition) => {
  return Product.findOne({
    where: queryCondition,
  });
};

const getAllProducts = async (queryCondition) => {
  const {
    createdAtStart,
    createdAtEnd,
    updatedAtStart,
    updatedAtEnd,
    sortBy,
    sortOrder = "ASC",
    ...otherConditions
  } = queryCondition;

  let whereCondition = { ...otherConditions };

  // Handle date range filtering
  if (createdAtStart && createdAtEnd) {
    whereCondition.createdAt = {
      [Op.gte]: createdAtStart,
      [Op.lte]: createdAtEnd,
    };
  } else if (createdAtStart) {
    whereCondition.createdAt = {
      [Op.gte]: createdAtStart,
    };
  } else if (createdAtEnd) {
    whereCondition.createdAt = {
      [Op.lte]: createdAtEnd,
    };
  }

  if (updatedAtStart && updatedAtEnd) {
    whereCondition.updatedAt = {
      [Op.gte]: updatedAtStart,
      [Op.lte]: updatedAtEnd,
    };
  } else if (updatedAtStart) {
    whereCondition.updatedAt = {
      [Op.gte]: updatedAtStart,
    };
  } else if (updatedAtEnd) {
    whereCondition.updatedAt = {
      [Op.lte]: updatedAtEnd,
    };
  }

  // Handle sorting
  const order = [];
  if (sortBy) {
    order.push([sortBy, sortOrder.toUpperCase()]);
  }

  return Product.findAll({
    where: whereCondition,
    order: order.length ? order : undefined,
  });
};

const updateProduct = async (queryCondition, update) => {
  return Product.update(update, {
    where: queryCondition,
  });
};

const deleteProduct = async (queryCondition) => {
  return Product.destroy({
    where: queryCondition,
  });
};

module.exports = {
  createProduct,
  getProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
};
