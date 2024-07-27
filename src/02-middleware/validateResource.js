const Joi = require("joi");
const logger = require("../01-utils/logger");

const validateResource = (schema) => (req, res, next) => {
  try {
    const { body, query, params } = req;
    const { error } = schema.validate({ body, query, params });
    if (!error) {
      next();
    } else {
      return res.status(400).json({ error: error.details[0].message });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = validateResource;
