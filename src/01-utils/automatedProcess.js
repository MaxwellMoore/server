const { getEmailList, getEmail } = require("../04-services/email.service");
const {
  getProduct,
  updateProduct,
  createProduct,
} = require("../04-services/product.service");
const Token = require("../05-models/token.model");

const autoProcess = async () => {
  try {
    const tokens = await Token.findAll();

    tokens.forEach(async (entry) => {
      // Use entry.access_token to retrieve all emails newer than two days
      const accessToken = entry.dataValues.access_token;
      const emailList = await getEmailList(accessToken);
      emailList.forEach(async (email) => {
        // Use email ID to retrieve email content
        const emailId = email.id;
        const emailContent = await getEmail(accessToken, emailId);

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
