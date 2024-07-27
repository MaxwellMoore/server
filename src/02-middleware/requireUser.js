const requireUser = (req, res, next) => {
  const user = res.locals.user;

  if (!user) {
    return res.status(403).send({ error: "Unauthorized" });
  }

  return next();
};

module.exports = requireUser;
