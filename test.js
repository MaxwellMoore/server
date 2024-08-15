const config = require("./config/default");
const {
  getEmailList,
  getEmail,
  processEmail,
} = require("./src/04-services/email.service");

(async () => {
  const access_token = config.devAccessToken;
  const emailId = "1915624c1122e9c0";
  try {
    const response = await getEmail(access_token, emailId);
    const result = await processEmail(response);
    console.log({ result });
  } catch (error) {
    console.error(error);
  }
})();
