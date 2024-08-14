const User = require("../05-models/user.model");
const Token = require("../05-models/token.model");
const logger = require("../01-utils/logger");

const createToken = async (input) => {
  try {
    const token = new Token(input);
    await token.save();
    return token.dataValues;
  } catch (error) {
    logger.error(error);
  }
};

const getToken = async (queryCondition) => {
  try {
    const token = await Token.findOne({
      where: queryCondition,
    });

    if (!token) {
      return null;
    }

    return token.toJSON();
  } catch (error) {
    logger.error(error);
  }
};

const updateToken = async (queryCondition, update) => {
  return Token.update(update, {
    where: queryCondition,
  });
};

module.exports = {
  createToken,
  getToken,
  updateToken,
};
