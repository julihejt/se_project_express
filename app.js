const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("connect to DB");
  })
  .catch((e) => console.error(e));

app.use("/", mainRouter); // allows ut to register routes and middleware

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
