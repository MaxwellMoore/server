const config = require("./config/default");
const { getEmail } = require("./src/04-services/email.service");
const { getOAuthAccessToken } = require("./src/04-services/user.service");

(async () => {
  const refreshToken = config.devRefreshToken;
  const accessToken = await getOAuthAccessToken({ refreshToken });
  // const emails = [
  //   {
  //     messageId: "",
  //     category: ""
  //   }
  // ]
})();
