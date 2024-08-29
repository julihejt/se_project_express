// Import necessary modules
const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index"); // Import the main router for handling routes

// Create an instance of the Express application
const app = express();

// Get the port from environment variables or default to 3001
const { PORT = 3001 } = process.env;

// Disable strict query mode in Mongoose (for compatibility with older Mongoose versions)
mongoose.set("strictQuery", false);

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); // Log a message when the server starts
});

// Connect to the MongoDB database
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db") // Connect to the database at this URI
  .then(() => {
    console.log("Connected to DB"); // Log a success message if the connection is successful
  })
  .catch((e) => console.error(e)); // Log any errors if the connection fails

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware to add a mock user to the request object
app.use((req, res, next) => {
  req.user = {
    _id: "5d8b8592978f8bd833ca8133", // Set a static user ID for demonstration purposes
  };
  next(); // Call the next middleware or route handler
});

// Use the main router for handling all routes
app.use("/", mainRouter);
