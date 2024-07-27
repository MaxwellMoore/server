const jwt = require("jsonwebtoken");
const config = require("../../config/default");
const logger = require("./logger");

const privateKey = config.privateKey;
const publicKey = config.publicKey;

const signJwt = (payload, expiresIn) => {
  return jwt.sign(payload, privateKey, {
    expiresIn: expiresIn,
    algorithm: "RS256",
  });
};

const verifyJwt = (token) => {
  try {
    const decoded = jwt.verify(token, publicKey);
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (error) {
    logger.error(error);
    return {
      valid: false,
      expired: error.message === "jwt expired",
      decoded: null,
    };
  }
};

module.exports = {
  signJwt,
  verifyJwt,
};
