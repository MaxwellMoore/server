const { omit } = require("lodash");
const logger = require("../01-utils/logger");
const { createUser, getUser } = require("../04-services/user.service");
const { createSession } = require("../04-services/session.service");
const { signJwt } = require("../01-utils/jwt.utils");
const config = require("../../config/default");

const accessTokenCookieOptions = {
  maxAge: 900000, // 15 mins
  httpOnly: true,
  domain: "localhost", //TODO: Change this domain for production (want to get from config)
  path: "/",
  sameSite: "lax",
  secure: false, //TODO: Change secure to true for production (want to get from config)
};

const refreshTokenCookieOptions = {
  maxAge: 3.154e10, // 1 year
  httpOnly: true,
  domain: "localhost", //TODO: Change this domain for production (want to get from config)
  path: "/",
  sameSite: "lax",
  secure: false, //TODO: Change secure to true for production (want to get from config)
};

const createUserHandler = async (req, res) => {
  payload = req.body;

  try {
    const existingUser = await getUser({ email: payload.email });
    if (existingUser) {
      return res.status(409).send({ error: "User already exists" });
    } else {
      // Create user
      const user = await createUser(payload);

      // Create session
      const session = await createSession(user.user_id);

      // Create access token
      const accessToken = signJwt(
        { ...user, session_id: session.session_id },
        config.accessTokenTtl // 15 minutes
      );

      // Create refresh token
      const refreshToken = signJwt(
        { ...user, session_id: session.session_id },
        config.refreshTokenTtl // 1 year
      );

      // Attach access and refresh tokens to cookies
      res.cookie("accessToken", accessToken, accessTokenCookieOptions);
      res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

      return res.send(omit(user, ["password"]));
    }
  } catch (error) {
    logger.error(error);
    return res.status(409).send(error.message);
  }
};

const getCurrentUserHandler = async (req, res) => {
  res.status(200).send(res.locals.user);
};

const getUserHandler = async (req, res) => {
  const payload = req.body;
  const user = await getUser({ email: payload.email }, payload.password);

  switch (user) {
    case false:
      res.status(401).send({ error: "Incorrect email or password" });
      break;
    case null:
      res.status(404).send({ error: "User not found" });
      break;
    default:
      try {
        // Create session
        const session = await createSession(user.user_id);

        // Create access token
        const accessToken = signJwt(
          { ...user, session_id: session.session_id },
          config.accessTokenTtl // 15 minutes
        );

        // Create refresh token
        const refreshToken = signJwt(
          { ...user, session_id: session.session_id },
          config.refreshTokenTtl // 1 year
        );

        // Attach access and refresh tokens to cookies
        res.cookie("accessToken", accessToken, accessTokenCookieOptions);
        res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

        // Redirect back to client
        // res.redirect(`${config.origin}`);
        res.send();
      } catch (error) {
        logger.error(error);
      }
      break;
  }
};

module.exports = {
  createUserHandler,
  getCurrentUserHandler,
  getUserHandler,
};
