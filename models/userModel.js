const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true }, // username of the user
  password: { type: String, required: true },
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
