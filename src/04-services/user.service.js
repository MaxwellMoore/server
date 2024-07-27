const axios = require("axios");
const qs = require("qs");
const { omit } = require("lodash");
const config = require("../../config/default");
const logger = require("../01-utils/logger");
const User = require("../05-models/user.model");

const createUser = async (input) => {
  try {
    const user = new User(input);
    await user.save();
    return user.dataValues;
  } catch (error) {
    logger.error(error);
  }
};

const getUser = async (queryCondition) => {
  try {
    const user = await User.findOne({
      where: queryCondition,
    });

    if (!user) {
      return null;
    }

    return omit(user.toJSON(), ["password", "updatedAt", "createdAt"]);

    // const isValid = user.comparePassword(password);

    // if (!isValid) {
    //   return false;
    // } else {
    //   return omit(user.toJSON(), ["password", "updatedAt", "createdAt"]);
    // }
  } catch (error) {
    logger.error(error);
  }
};

const getGoogleOAuthTokens = async ({ code }) => {
  const url = "https://oauth2.googleapis.com/token";

  const values = {
    code,
    client_id: config.googleClientId,
    client_secret: config.googleClientSecret,
    redirect_uri: config.googleOauthRedirectUrl,
    grant_type: "authorization_code",
  };

  try {
    const res = await axios.post(url, qs.stringify(values), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return res.data;
  } catch (error) {
    logger.error(error, "Failed to fetch google oauth tokens");
  }
};

const validatePassword = async (payload) => {
  try {
    const user = await User.findOne({
      where: payload,
    });

    if (!user) {
      return false;
    }

    logger.info(payload.password);
    // Might be some issues with the comparePassword method
    const isValid = await user.comparePassword(payload.password);
    logger.info(isValid);

    if (!isValid) return false;

    return omit(user.toJSON(), ["password"]);
  } catch (error) {
    logger.error(error);
  }
};

module.exports = {
  createUser,
  getUser,
  getGoogleOAuthTokens,
  validatePassword,
};
