const tokenModel = require("./models/tokenModel");

module.exports = {
  authMiddleware: async function (req, res, next) {
    const authorization = await req.headers?.authorization;
    let tokenTest = null;
    if (authorization) tokenTest = authorization.split(" ")[1];
    if (!tokenTest) {
      res.status(400).json({ message: "Invalid authorization header" });
      return;
    }
    const token = await tokenModel
      .findOne({ token_id: tokenTest })
      .populate("user_id")
      .catch((err) => {});

    if (!token || token.expire_at <= Date.now()) {
      tokenModel.deleteOne({ token_id: tokenTest }).catch((err) => {});
      res.status(404).json({ message: "Token expired" });
      return;
    }
    // na min ginete update me kathe request
    await tokenModel.updateOne(
      { token_id: token.token_id },
      {
        expire_at: Date.now() + 1000 * 60 * 60 * 60 * 24,
      }
    );

    req.user = token.user_id;
    next();
  },
};
