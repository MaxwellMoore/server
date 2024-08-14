const { getEmailList, getEmail } = require("./src/04-services/email.service");

const fetchEmails = async () => {
  const access_token = "";

  const emailList = await getEmailList(access_token, 1);
  const id = emailList[0].id;

  const email = getEmail(access_token, id);
  return email;
};

(async () => {
  try {
    const data = await fetchEmails();
    console.log({ data });
  } catch (error) {
    console.error("Error fetching emails:", error);
  }
})();
