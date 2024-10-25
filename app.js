// Import necessary modules
const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index"); // Import the main router for handling routes

// Create an instance of the Express application
const app = express();

const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

// Get the port from environment variables or default to 3001
const { PORT = 3001 } = process.env;

// Disable strict query mode in Mongoose
mongoose.set("strictQuery", false);

// Connect to the MongoDB database
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((e) => console.error(e));

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(cors());

// Main routes
app.use("/", mainRouter);

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
