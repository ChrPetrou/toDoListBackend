const express = require("express");
const app = express();
app.use(express.json());
require("dotenv").config();
var cors = require("cors");
const mongoose = require("mongoose");
const todoItems = require("./routes/todo.js");
const PORT = 4000;

app.use(cors());

const connection = mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected!"))
  .catch((err) => console.log("Connection Error:", err));

app.use("/todo-list", todoItems);

app.listen(PORT, () => {
  console.log(`Server started on port http://localhost:${PORT}`);
});
