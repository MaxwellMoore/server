const { max } = require("lodash");
const jwt = require("jsonwebtoken");
const config = require("../../config/default");
const { signJwt, verifyJwt } = require("../01-utils/jwt.utils");
const logger = require("../01-utils/logger");
const {
  createSession,
  getSessions,
  updateSessions,
} = require("../04-services/session.service");
const {
  validatePassword,
  getUser,
  getGoogleOAuthTokens,
} = require("../04-services/user.service");
const { getLastEmail } = require("../04-services/product.service");
const { getEmailList, getEmail } = require("../04-services/email.service");

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

const createSessionHandler = async (req, res) => {
  // Get user
  const payload = req.body;
  const user = await getUser({ email: payload.email });

  switch (user) {
    // Incorrect password
    case false:
      res.status(401).send({ error: "Incorrect email or password" });
      break;

    // User not found
    case null:
      res.status(404).send({ error: "User not found" });
      break;

    // User found
    default:
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

      // Return access and refresh tokens
      res.status(200).send({ accessToken, refreshToken });
      break;
  }
};

const googleOauthHandler = async (req, res) => {
  try {
    // Get code from qs
    const code = req.query.code;

    // Get id and accessToken with code
    const { id_token, access_token } = await getGoogleOAuthTokens({ code });
    logger.info({ id_token, access_token });

    // Get user with tokens
    const googleUser = jwt.decode(id_token);
    logger.info({ googleUser });

    if (!googleUser.email_verified) {
      return res.status(403).send("Google account is not verified");
    }

    // Get user
    const user = await getUser({ email: googleUser.email });
    logger.info({ user });

    // Return if user does not exist
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

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
    res.redirect(`${config.origin}`);
  } catch (error) {
    logger.error(error, "Failed to authorize Google user");
    return res.redirect(`${config.origin}/oauth/error`);
  }
};

const getSessionsHandler = async (req, res) => {
  const user = res.locals.user;

  const sessions = await getSessions({ user_id: user.user_id, valid: true });

  if (sessions.length === 0) {
    res.status(404).send({ error: "No sessions found" });
  } else {
    res.status(200).send(sessions);
  }
};

const deleteSessionHandler = async (req, res) => {
  const sessionId = res.locals.user.session_id;

  await updateSessions({ session_id: sessionId }, { valid: false });

  return res.status(200).send({
    accessToken: null,
    refreshToken: null,
  });
};

module.exports = {
  createSessionHandler,
  googleOauthHandler,
  getSessionsHandler,
  deleteSessionHandler,
};
