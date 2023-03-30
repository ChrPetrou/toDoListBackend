const express = require("express");

require("dotenv").config();
var cors = require("cors");
const mongoose = require("mongoose");
const todoItems = require("./routes/todo.js");
const users = require("./routes/users");
const PORT = 4000;

const main = async () => {
  const app = express();
  app.use(express.json());

  app.use(cors());

  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected!");

  app.use("/todo-list", todoItems);

  app.use("/users", users);

  app.listen(PORT, () => {
    console.log(`Server started on port http://localhost:${PORT}`);
  });
};

main();
