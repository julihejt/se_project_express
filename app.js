require("dotenv").config();
// Import necessary modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
const mainRouter = require("./routes/index"); // Import the main router for handling routes
const errorHandler = require("./middlewares/errorHandler");
const { requestLogger, errorLogger } = require("./middlewares/logger"); // Ensure logger is imported before use

// Create an instance of the Express application
const app = express();

// Configure CORS
app.use(
  cors({
    origin: "*",
  })
);

// Use the request logger middleware
app.use(requestLogger);

// server crash testing
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

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

// Use error logger middleware
app.use(errorLogger);

// celebrate error handler
app.use(errors());

// Centralized error handler
app.use(errorHandler);

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
