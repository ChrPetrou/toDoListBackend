const { string } = require("joi");
const mongoose = require("mongoose");
const { Schema } = mongoose;
const userModel = require("./userModel");

const tokenSchema = new Schema({
  user_id: { type: mongoose.Types.ObjectId, ref: userModel, required: true },
  token_id: { type: String, unique: true, required: true },
  expire_at: { type: Date, required: true },
});

const tokenModel = mongoose.model("tokenItem", tokenSchema);

module.exports = tokenModel;
