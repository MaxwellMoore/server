const config = require("./config/default");
const { getEmailList, getEmail } = require("./src/04-services/email.service");
const { getDate } = require("./src/01-utils/date");
const { createToken, getToken } = require("./src/04-services/token.service");
const { getUser } = require("./src/04-services/user.service");
const Token = require("./src/05-models/token.model");
const { autoProcess } = require("./src/01-utils/automatedProcess");

const fetchEmails = async () => {
  const access_token = config.devAccessToken;

  const emailList = await getEmailList(access_token, 1);
  return emailList;
  // const id = emailList[0].id;

  // const email = getEmail(access_token, id);
  // return email;
};

(async () => {
  autoProcess();
  // const access_token = config.devAccessToken;
  // try {
  //   const response = await getEmailList(access_token);
  //   response.forEach((message) => {
  //     const id = message.id;
  //     console.log({ id });
  //   });
  // } catch (error) {
  //   console.error(error);
  // }
})();
