// Import the Express Router to handle routing for user-related endpoints
const router = require("express").Router();

// Import the controller functions for user operations
const { getUsers, createUser, getUser } = require("../controllers/users");

// Define the route to get a list of all users
// GET /users - Retrieves a list of all users
router.get("/", getUsers);

// Define the route to get a specific user by their ID
// GET /users/:userId - Retrieves a user with the specified userId
router.get("/:userId", getUser);

// Define the route to create a new user
// POST /users - Creates a new user with the data provided in the request body
router.post("/", createUser);

// Export the router so it can be used in the main application file
module.exports = router;
