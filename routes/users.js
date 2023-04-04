const bcrypt = require("bcrypt");
const Joi = require("joi");
const express = require("express");
const router = express.Router();
const randomToken = require("random-token");

const userModel = require("../models/userModel");
const tokenModel = require("../models/tokenModel");

const schemaCreateUser = Joi.object().keys({
  email: Joi.string()
    .email({ tlds: { allow: ["com", "net"] } })
    .required(),
  password: Joi.string().required(),
});

router.post("/sign-in/", async (req, res) => {
  const { value, error } = schemaCreateUser.validate(req.body);

  if (error) {
    res.status(400).json(error);
    return error;
  }
  let user = await userModel
    .findOne({
      email: value.email,
    })
    .catch((err) => {});

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  const cmp = await bcrypt.compare(req.body.password, user.password);
  if (!cmp) {
    res.status(404).json({ message: "Passwords not match" });
    return;
  }

  const newdate = Date.now() + 1000 * 60 * 60 * 60 * 24;
  let token;
  const countUserTokens = await tokenModel.count({ user_id: user._id });
  // if the user already has 3 tokens just updates one of them else create another
  if (countUserTokens >= 3) {
    token = await tokenModel.findOneAndUpdate(
      { user_id: user._id },
      {
        token_id: randomToken(64),
        expire_at: newdate,
      },
      { sort: { expire_at: 1 }, returnOriginal: false }
    );
  } else {
    token = await tokenModel
      .create({
        user_id: user._id,
        token_id: randomToken(64),
        expire_at: newdate,
      })
      .catch((err) => {});

    if (!token) {
      res.status(500).json();
      return;
    }
  }

  user = user.toJSON();
  delete user.password;

  res.status(202).json({
    user: user,
    tokenId: token.token_id,
    tokenExpire: token.expire_at,
  });
});

router.post("/register", async (req, res) => {
  const saltRounds = 10;
  const { value, error } = schemaCreateUser.validate(req.body);
  if (error) {
    res.status(400).json(error);
    return error;
  }

  const hash = await bcrypt.hash(value.password, saltRounds);
  const newUser = await userModel
    .create({
      email: value.email,
      password: hash,
    })
    .catch((err) => {});
  if (!newUser) {
    res.status(403).json({ message: "Email Already exist" });
    return;
  }

  const newdate = Date.now() + 1000 * 60;

  const newToken = await tokenModel.create({
    user_id: newUser._id,
    token_id: randomToken(64),
    expire_at: newdate,
  });
  const user = newUser.toJSON();
  delete user.password;
  res.status(201).json({
    user: user,
    token_id: newToken.token_id,
    expire_at: newToken.expire_at,
  });
});

router.delete("/logout/:token_id", async (req, res) => {
  const tokenToDelete = await tokenModel
    .deleteOne({ token_id: req.params.token_id })
    .catch((err) => {});
  if (!tokenToDelete) {
    res.status(404).json({ message: "Logout" });
    return;
  }
  res.status(202).json({ message: "Logout" });
});

module.exports = router;
