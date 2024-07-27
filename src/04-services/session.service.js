const { get } = require("lodash");
const config = require("../../config/default");
const { verifyJwt, signJwt } = require("../01-utils/jwt.utils");
const logger = require("../01-utils/logger");
const Session = require("../05-models/session.model");
const { getUser } = require("./user.service");

const createSession = async (userId) => {
  try {
    const session = new Session({ user_id: userId });
    await session.save();
    return session;
  } catch (error) {
    logger.error(error);
  }
};

const getSessions = async (queryCondition) => {
  return Session.findAll({
    where: queryCondition,
  });
};

const updateSessions = async (queryCondition, update) => {
  try {
    return Session.update(update, {
      where: queryCondition,
    });
  } catch (error) {
    logger.error(error);
  }
};

const reIssueAccessToken = async (refreshToken) => {
  const { decoded } = verifyJwt(refreshToken);

  if (!decoded || !get(decoded, "session_id")) {
    return false;
  }

  const session = await Session.findByPk(get(decoded, "session_id"));

  if (!session || !session.valid) {
    return false;
  }

  const user = await getUser({ user_id: session.user_id });

  if (!user) {
    return false;
  }

  const accessToken = signJwt(
    { ...user, session_id: session.session_id },
    config.accessTokenTtl // 15 minutes
  );

  return accessToken;
};

module.exports = {
  createSession,
  getSessions,
  updateSessions,
  reIssueAccessToken,
};
