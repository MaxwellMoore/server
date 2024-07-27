const Joi = require("joi");

const createSessionSchema = Joi.object({
  body: Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Not a valid email",
      "any.required": "Email is required",
    }),
    password: Joi.string().min(6).required().messages({
      "string.min": "Password must be more than 5 chars",
      "any.required": "Password is required",
    }),
  }),
  query: Joi.object().optional(),
  params: Joi.object().optional(),
});

module.exports = {
  createSessionSchema,
};
