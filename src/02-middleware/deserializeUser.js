const { get } = require("lodash");
const { verifyJwt } = require("../01-utils/jwt.utils");
const logger = require("../01-utils/logger");
const { reIssueAccessToken } = require("../04-services/session.service");

const deserializeUser = async (req, res, next) => {
  let accessToken =
    get(req, "cookies.accessToken") ||
    get(req, "headers.authorization", "").replace(/^Bearer\s/, "");

  const refreshToken =
    get(req, "cookies.refreshToken") || get(req, "headers.x-refresh");

  if (accessToken.length === 0 && refreshToken) {
    // If access token is missing but refresh token is present, try to reissue a new access token
    const newAccessToken = await reIssueAccessToken(refreshToken);

    if (newAccessToken) {
      res.setHeader("x-access-token", newAccessToken);

      res.cookie("accessToken", newAccessToken, {
        maxAge: 900000, // 15 mins
        httpOnly: true,
        domain: "localhost",
        path: "/",
        sameSite: "strict",
        secure: false,
      });

      accessToken = newAccessToken;
    }
  }

  if (accessToken) {
    const { decoded, expired } = verifyJwt(accessToken);

    if (decoded) {
      res.locals.user = decoded;
      return next();
    }

    if (expired && refreshToken) {
      const newAccessToken = await reIssueAccessToken({ refreshToken });

      if (newAccessToken) {
        res.setHeader("x-access-token", newAccessToken);

        res.cookie("accessToken", newAccessToken, {
          maxAge: 900000, // 15 mins
          httpOnly: true,
          domain: "localhost",
          path: "/",
          sameSite: "strict",
          secure: false,
        });

        const result = verifyJwt(newAccessToken);

        res.locals.user = result.decoded;
        return next();
      }
    }
  }

  return next();
};

module.exports = deserializeUser;

// const { get } = require("lodash");
// const { verifyJwt } = require("../01-utils/jwt.utils");
// const logger = require("../01-utils/logger");
// const { reIssueAccessToken } = require("../04-services/session.service");

// const deserializeUser = async (req, res, next) => {
//   // Retrieve access and refresh tokens
//   const accessToken =
//     get(req, "cookies.accessToken") ||
//     get(req, "headers.authorization", "").replace(/^Bearer\s/, "");

//   const refreshToken =
//     get(req, "cookies.refreshToken") || get(req, "headers.x-refresh");

//   // Continue without accessToken for login
//   if (!accessToken) {
//     return next();
//   }

//   // Extract valid user object and attach to response object
//   const { decoded, expired } = verifyJwt(accessToken);
//   if (decoded) {
//     res.locals.user = decoded;
//     return next();
//   }

//   if (expired && refreshToken) {
//     const newAccessToken = await reIssueAccessToken(refreshToken);

//     if (newAccessToken) {
//       res.setHeader("x-access-token", newAccessToken);

//       res.cookie("accessToken", newAccessToken, {
//         maxAge: 900000, // 15 mins
//         httpOnly: true,
//         domain: "localhost", //TODO: Change this domain for production
//         path: "/",
//         sameSite: "strict",
//         secure: false, //TODO: Change secure to true for production
//       });
//     }

//     const result = verifyJwt(newAccessToken);

//     res.locals.user = result.decoded;
//     return next();
//   }

//   return next();
// };

// module.exports = deserializeUser;
