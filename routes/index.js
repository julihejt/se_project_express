// Import the Express Router to handle routing
const router = require("express").Router();

// Import the NOT_FOUND error code for handling 404 errors
const { NOT_FOUND } = require("../utils/errors");

// Import the routers for user-related and clothing item-related routes
const userRouter = require("./users");
const itemRouter = require("./clothingItems");

// Use the userRouter for all routes starting with /users
// This will route requests like /users and /users/:userId to the userRouter
router.use("/users", userRouter);

// Use the itemRouter for all routes starting with /items
// This will route requests like /items and /items/:itemId to the itemRouter
router.use("/items", itemRouter);

// Define a fallback route to handle 404 errors
// This will catch any requests that don't match the above routes
router.use((req, res) => {
  // Send a 404 status code and a message indicating that the resource was not found
  res.status(NOT_FOUND).send({ message: "Resource not found" });
});

// Export the main router so it can be used in the main application file
module.exports = router;
