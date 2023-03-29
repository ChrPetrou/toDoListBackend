const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = Schema;

const todoListSchema = new Schema({
  text: { type: String, required: true },
  isCompleted: Boolean,
});

const todoListModel = mongoose.model("todoItems", todoListSchema);

module.exports = todoListModel;
