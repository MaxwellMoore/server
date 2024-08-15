const config = require("./config/default");
const {
  getEmailList,
  getEmail,
  processEmail,
} = require("./src/04-services/email.service");
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
  const access_token = config.devAccessToken;
  const emailId = "1915624c1122e9c0";
  try {
    const response = await getEmail(access_token, emailId);
    processEmail(response);
    // const data = response.data;
    // const payload = data.payload;
    // const headers = payload.headers;
    // const body = payload.body;
    // const parts = payload.parts;
    // const base64String = parts[1].body.data;
    // const decodedString = Buffer.from(base64String, "base64").toString("utf-8");
    // console.log({ decodedString });
    // response.forEach((message) => {
    //   const id = message.id;
    //   console.log({ id });
    // });
  } catch (error) {
    console.error(error);
  }
})();
