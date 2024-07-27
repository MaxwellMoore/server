const Joi = require("joi");

const createProductSchema = Joi.object({
  body: Joi.object({
    title: Joi.string().required().messages({
      "any.required": "Title is required",
    }),
    company: Joi.string().required().messages({
      "any.required": "Company is required",
    }),
    status: Joi.string().required().messages({
      "any.required": "Status is required",
    }),
  }),
  query: Joi.object().optional(),
  params: Joi.object().optional(),
});

const getProductSchema = Joi.object({
  body: Joi.object().optional(),
  query: Joi.object().optional(),
  params: Joi.object({
    productId: Joi.number().required().messages({
      "any.required": "ProductId is required",
    }),
  }),
});

const updateProductSchema = Joi.object({
  body: Joi.object({
    title: Joi.string().required().messages({
      "any.required": "Title is required",
    }),
    company: Joi.string().required().messages({
      "any.required": "Company is required",
    }),
    status: Joi.string().required().messages({
      "any.required": "Status is required",
    }),
  }),
  query: Joi.object().optional(),
  params: Joi.object({
    productId: Joi.number().required().messages({
      "any.required": "ProductId is required",
    }),
  }),
});

const deleteProductSchema = Joi.object({
  body: Joi.object().optional(),
  query: Joi.object().optional(),
  params: Joi.object({
    productId: Joi.number().required().messages({
      "any.required": "ProductId is required",
    }),
  }),
});

module.exports = {
  createProductSchema,
  getProductSchema,
  updateProductSchema,
  deleteProductSchema,
};
