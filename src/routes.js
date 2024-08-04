const { valid } = require("joi");
const logger = require("./01-utils/logger");
const requireUser = require("./02-middleware/requireUser");
const validateResource = require("./02-middleware/validateResource");
const {
  createProductHandler,
  getProductHandler,
  updateProductHandler,
  deleteProductHandler,
  getAllProductsHandler,
} = require("./03-controllers/product.controller");
const {
  createSessionHandler,
  getSessionsHandler,
  deleteSessionHandler,
  googleOauthHandler,
} = require("./03-controllers/session.controller");
const {
  createUserHandler,
  getUserHandler,
  getCurrentUserHandler,
} = require("./03-controllers/user.controller");
const {
  createProductSchema,
  getProductSchema,
  updateProductSchema,
  deleteProductSchema,
} = require("./06-schemas/product.schema");
const { createSessionSchema } = require("./06-schemas/session.schema");
const { createUserSchema, getUserSchema } = require("./06-schemas/user.schema");

const routes = (app) => {
  app.get("/healthcheck", (req, res) => {
    res.sendStatus(200);
  });

  // User routes
  app.post(
    "/api/register",
    validateResource(createUserSchema),
    createUserHandler
  );
  app.post("/api/login", validateResource(getUserSchema), getUserHandler);
  app.get("/api/me", requireUser, getCurrentUserHandler);
  app.get("/googleRedirectUri", googleOauthHandler);

  app.delete("/api/users");

  // Session routes
  app.post(
    "/api/sessions",
    validateResource(createSessionSchema),
    createSessionHandler
  );
  app.get("/api/sessions", requireUser, getSessionsHandler);
  app.delete("/api/sessions", requireUser, deleteSessionHandler);

  // Product routes
  app.post(
    "/api/products",
    requireUser,
    validateResource(createProductSchema),
    createProductHandler
  );
  app.get("/api/products", requireUser, getAllProductsHandler);
  app.get(
    "/api/products/:productId",
    requireUser,
    validateResource(getProductSchema),
    getProductHandler
  );
  app.put(
    "/api/products/:productId",
    requireUser,
    validateResource(updateProductSchema),
    updateProductHandler
  );
  app.delete(
    "/api/products/:productId",
    requireUser,
    validateResource(deleteProductSchema),
    deleteProductHandler
  );
};

module.exports = routes;
