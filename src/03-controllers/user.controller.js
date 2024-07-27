const { omit } = require("lodash");
const logger = require("../01-utils/logger");
const { createUser, getUser } = require("../04-services/user.service");

const createUserHandler = async (req, res) => {
  payload = req.body;

  try {
    const existingUser = await getUser({ email: payload.email });
    if (existingUser) {
      return res.status(409).send({ error: "User already exists" });
    } else {
      const user = await createUser(req.body);
      return res.send(omit(user, ["password"]));
    }
  } catch (error) {
    logger.error(error);
    return res.status(409).send(error.message);
  }
};

const getCurrentUserHandler = async (req, res) => {
  res.status(200).send(res.locals.user);
};

const getUserHandler = async (req, res) => {
  const payload = req.body;
  const user = await getUser({ email: payload.email }, payload.password);

  switch (user) {
    case false:
      res.status(401).send({ error: "Incorrect email or password" });
      break;
    case null:
      res.status(404).send({ error: "User not found" });
      break;
    default:
      res.status(200).send(user);
      break;
  }
};

module.exports = {
  createUserHandler,
  getCurrentUserHandler,
  getUserHandler,
};
