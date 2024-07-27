const { processEmail } = require("./src/04-services/email.service");

const data = { text: "This is my test email data" };

(async () => {
  try {
    const result = await processEmail(data);
    const processed = result.processed;
    console.log(processed);
  } catch (error) {
    console.error({ error: error });
  }
})();
