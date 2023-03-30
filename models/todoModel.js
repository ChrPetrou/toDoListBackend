const mongoose = require("mongoose");
const { Schema } = mongoose;
const userModel = require("./userModel");

const todoListSchema = new Schema({
  text: { type: String, required: true },
  isCompleted: Boolean,
  user_id: { type: mongoose.Types.ObjectId, ref: userModel },
});

const todoListModel = mongoose.model("todoItems", todoListSchema);

module.exports = todoListModel;
