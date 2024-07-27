const logger = require("../01-utils/logger");
const {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../04-services/product.service");

const createProductHandler = async (req, res) => {
  const userId = res.locals.user.user_id;
  const payload = req.body;

  try {
    const product = await createProduct({ ...payload, user_id: userId });
    res.status(200).send(product);
  } catch (error) {
    logger.error(error);
  }
};

const getProductHandler = async (req, res) => {
  const userId = res.locals.user.user_id;
  const productId = req.params.productId;

  try {
    const product = await getProduct({ product_id: productId });

    if (!product) {
      res.status(404).send({ error: "Product not found" });
    }

    if (product.user_id !== userId) {
      res.status(403).send({ error: Unathorized });
    }

    res.status(200).send(product);
  } catch (error) {
    logger.error(error);
  }
};

const updateProductHandler = async (req, res) => {
  const userId = res.locals.user.user_id;
  const productId = req.params.productId;
  const update = req.body;

  try {
    const product = await getProduct({ product_id: productId });

    if (!product) {
      res.status(404).send({ error: "Product not found" });
    }

    if (product.user_id !== userId) {
      res.status(403).send({ error: Unathorized });
    }

    const updatedProduct = await updateProduct(
      { product_id: productId },
      update
    );

    res.status(200).send(updatedProduct);
  } catch (error) {
    logger.error(error);
  }
};

const deleteProductHandler = async (req, res) => {
  const userId = res.locals.user.user_id;
  const productId = req.params.productId;

  try {
    const product = await getProduct({ product_id: productId });

    if (!product) {
      res.status(404).send({ error: "Product not found" });
    }

    if (product.user_id !== userId) {
      res.status(403).send({ error: Unathorized });
    }

    const destroyed = await deleteProduct({ product_id: productId });

    res.status(200).send({ destroyed: destroyed });
  } catch (error) {
    logger.error(error);
  }
};

module.exports = {
  createProductHandler,
  getProductHandler,
  updateProductHandler,
  deleteProductHandler,
};
