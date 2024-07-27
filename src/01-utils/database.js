const { Sequelize } = require("sequelize");
const logger = require("./logger");

const database = new Sequelize("solar_flare", "dev_user", "dev_user", {
  host: "localhost",
  dialect: "mysql",
});

const connect = async () => {
  database
    .sync({ alter: true })
    .then(() => {
      logger.info("Database synced");
    })
    .catch((error) => {
      logger.error("Unable to sync database:", error);
    });
};

module.exports = {
  database,
  connect,
};
