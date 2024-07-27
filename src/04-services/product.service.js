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
  updateProduct,
  deleteProduct,
};
