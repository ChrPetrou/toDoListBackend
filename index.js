const express = require("express");
const app = express();
const PORT = 4000;
app.use(express.json());
const Joi = require("joi");

var cors = require("cors");

app.use(cors());

let toDoList = [
  {
    id: "1", // unique id (random number)
    text: "Buy milk", // text of the todoItem
    isCompleted: false, // boolean indicating if the todoItem is completed or not
  },
  {
    id: "2", // unique id (random number)
    text: "Buy water", // text of the todoItem
    isCompleted: false, // boolean indicating if the todoItem is completed or not
  },
  {
    id: "3", // unique id (random number)
    text: "Buy soya", // text of the todoItem
    isCompleted: false, // boolean indicating if the todoItem is completed or not
  },
  {
    id: "4", // unique id (random number)
    text: "Buy kreparoli", // text of the todoItem
    isCompleted: false, // boolean indicating if the todoItem is completed or not
  },
  {
    id: "5", // unique id (random number)
    text: "Buy pipilo", // text of the todoItem
    isCompleted: false, // boolean indicating if the todoItem is completed or not
  },
];

const schemaCreate = Joi.object().keys({
  text: Joi.string().required(),
});

const schemaUpdate = Joi.object().keys({
  text: Joi.string(),
  isCompleted: Joi.boolean(),
});

app.get("/todo-list", (req, res) => {
  res.status(200).json(toDoList);
});

app.get("/todo-list/:id", (req, res) => {
  const toDoItem = toDoList.find((a) => a.id === req.params.id);

  if (!toDoItem) {
    res.status(404).json({ message: "Data not found" });
    return;
  }
  res.status(200).json(toDoItem);
});

app.post("/todo-list", (req, res) => {
  const { value, error } = schemaCreate.validate(req.body);

  if (error) {
    res.status(400).json(error);
    return;
  }

  const newToDoItem = {
    id: Math.floor(Math.random() * 10000000),
    text: value.text,
    isCompleted: false,
  };

  toDoList.push(newToDoItem);

  res.status(202).json(newToDoItem);
});

app.patch("/todo-list/:id", (req, res) => {
  const { error, value } = schemaUpdate.validate(req.body);

  if (error) {
    res.status(400).json(error);
    return;
  }

  let index = toDoList.findIndex((a, b) => a.id === req.params.id);

  if (index === -1) {
    res.status(404).json({ message: "Data not found" });
    return;
  }

  toDoList[index] = {
    ...toDoList[index],
    ...value,
  };

  res.status(202).json(toDoList[index]);
});

app.delete("/todo-list/:id", (req, res) => {
  let newToDoItem;
  toDoList = toDoList.filter((a) => {
    if (a.id === req.params.id) newToDoItem = a;
    return a.id !== req.params.id;
  });

  if (!newToDoItem) {
    res.status(404).json({ message: "Data not found" });
    return;
  }

  res.status(202).json(newToDoItem);
});

app.listen(PORT, () => {
  console.log(`Server started on port http://localhost:${PORT}`);
});
