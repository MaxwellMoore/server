const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const config = require("../config/default");
const routes = require("./routes");
const logger = require("./01-utils/logger");
const { connect } = require("./01-utils/database");
const deserializeUser = require("./02-middleware/deserializeUser");

const app = express();

// Config middleware
app.use(
  cors({
    origin: config.origin,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(deserializeUser);

// Sync the Sequelize models with the database
const port = config.port;
app.listen(port, async () => {
  logger.info(`Server is running at http://localhost:${port}`);

  await connect();

  routes(app);
});
