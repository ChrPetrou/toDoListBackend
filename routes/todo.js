const TodoItemsModel = require("../models/todoModel");
const tokenModel = require("../models/tokenModel");
const { tokenFunction } = require("../middleware");
const Joi = require("joi");
const express = require("express");
var router = express.Router();

const schemaCreate = Joi.object().keys({
  text: Joi.string().required(),
});

const schemaUpdate = Joi.object().keys({
  text: Joi.string(),
  isCompleted: Joi.boolean(),
});

// accept request
router.get("/", tokenFunction, async (req, res) => {
  console.log(req.user);
  const toDoList = await TodoItemsModel.find({ user_id: req.user._id });
  res.status(200).json(toDoList); // send response
});

router.get("/:id", async (req, res) => {
  const toDoItem = await TodoItemsModel.findById(req.params.id);
  if (!toDoItem) {
    res.status(404).json({ message: "Data not found!" });
    return;
  }
  res.status(200).json(toDoItem);
});

router.post("/", async (req, res) => {
  const { value, error } = schemaCreate.validate(req.body);

  if (error) {
    res.status(400).json(error);
    return;
  }

  const newToDoItem = await TodoItemsModel.create({
    text: value.text,
    isCompleted: false,
    // user_id: token.user_id,
  });

  res.status(202).json(newToDoItem);
});

router.patch("/:id", async (req, res) => {
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

router.delete("/:id", async (req, res) => {
  const obj = await todoListModel.findById(req.params.id).catch((err) => {});

  if (!obj) {
    res.status(404).json({ message: "Data not found" });
    return;
  }
  const deletedToDoItem = await TodoItemsModel.findByIdAndDelete(obj.id);
  res.status(202).json(deletedToDoItem);
});

module.exports = router;
