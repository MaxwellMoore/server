const {
  getProduct,
  updateProduct,
  createProduct,
} = require("../04-services/product.service");
const Token = require("../05-models/token.model");

const autoProcess = async () => {
  try {
    const data = await Token.findAll();

    data.forEach((entry) => {
      // Use entry.access_token to retrieve all emails within the time interval entry.last_checked to Date.now()
      const emails = [];
      emails.forEach(async (email) => {
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
