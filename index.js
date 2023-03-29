const express = require("express");
const app = express();
app.use(express.json());
const Joi = require("joi");
require("dotenv").config();
var cors = require("cors");
const mongoose = require("mongoose");
const PORT = 4000;
const TodoItemsModel = require("../backend/models/todoList");
const todoListModel = require("../backend/models/todoList");
app.use(cors());

const connection = mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected!"))
  .catch((err) => console.log("Connection Error:", err));

const schemaCreate = Joi.object().keys({
  text: Joi.string().required(),
});

const schemaUpdate = Joi.object().keys({
  text: Joi.string(),
  isCompleted: Joi.boolean(),
});

app.get("/todo-list", async (req, res) => {
  const toDoList2 = await TodoItemsModel.find();
  res.status(200).json(toDoList2);
});

app.get("/todo-list/:id", async (req, res) => {
  const toDoItem = await TodoItemsModel.findById(req.params.id);
  if (!toDoItem) {
    res.status(404).json({ message: "Data not found!" });
    return;
  }
  res.status(200).json(toDoItem);
});

app.post("/todo-list", async (req, res) => {
  const { value, error } = schemaCreate.validate(req.body);

  if (error) {
    res.status(400).json(error);
    return;
  }

  const newToDoItem = await TodoItemsModel.create({
    text: value.text,
    isCompleted: false,
  });

  res.status(202).json(newToDoItem);
});

app.patch("/todo-list/:id", async (req, res) => {
  const { error, value } = schemaUpdate.validate(req.body);

  if (error) {
    res.status(400).json(error);
    return;
  }
  let obj = await TodoItemsModel.findById(req.params.id).catch((err) => {});

  if (!obj) {
    res.status(404).json({ message: "Todo with that id not found" });
    return;
  }

  const newToDoItem = await TodoItemsModel.findByIdAndUpdate(
    obj._id,
    {
      text: value.text,
      isCompleted: value.isCompleted,
    },
    { returnDocument: "after" }
  );

  console.log(newToDoItem);

  res.status(202).json(newToDoItem);
});

app.delete("/todo-list/:id", async (req, res) => {
  const obj = await todoListModel.findById(req.params.id).catch((err) => {});

  if (!obj) {
    res.status(404).json({ message: "Data not found" });
    return;
  }
  const deletedToDoItem = await TodoItemsModel.findByIdAndDelete(obj.id);
  res.status(202).json(deletedToDoItem);
});

app.listen(PORT, () => {
  console.log(`Server started on port http://localhost:${PORT}`);
});
