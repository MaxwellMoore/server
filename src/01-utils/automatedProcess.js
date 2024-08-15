const { getEmailList, getEmail } = require("../04-services/email.service");
const {
  getProduct,
  updateProduct,
  createProduct,
} = require("../04-services/product.service");
const { getOAuthAccessToken } = require("../04-services/user.service");
const Token = require("../05-models/token.model");

const autoProcess = async () => {
  try {
    const tokens = await Token.findAll();

    tokens.forEach(async (entry) => {
      const refresh_token = entry.dataValues.refresh_token;
      const access_token = await getOAuthAccessToken({ refresh_token });

      // Use access_token to retrieve all emails newer than two days
      const emailList = await getEmailList(access_token);
      emailList.forEach(async (email) => {
        // Use email ID to retrieve email content
        const emailId = email.id;
        const emailContent = await getEmail(access_token, emailId);

        // Process email content
        // const processedData = processEmail(email);
        // const appRelated = textClassification(processedData);
        if (appRelated) {
          // ({ company, title, createdAt, updatedAt }) = infoRetrieval(processedData);
          // ({ status }) = textClassification(processedData)

          //? Implement Correct Logic: "getProduct" will return a message if no products are found. This could cause a false positive.
          // const appExists = getProduct({ company, title });
          if (appExists) {
            await updateProduct();
          } else {
            await createProduct();
          }
        }
      });
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports = { autoProcess };
