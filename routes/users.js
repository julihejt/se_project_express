// Import the Express Router to handle routing for user-related endpoints
const router = require("express").Router();

// Import the controller functions for user operations
const {
  getUsers,
  createUser,
  getUser,
  updateUser,
} = require("../controllers/users");

const auth = require("../middlewares/auth"); // Middleware for authorization

// GET /users - Retrieves a list of all users
router.get("/", auth, getUsers);

// GET /users/me - Retrieves the current logged-in user data
router.get("/me", auth, getUser);

// PATCH /users/me - Updates the profile of the current logged-in user
router.patch("/me", auth, updateUser);

// GET /users/:userId - Retrieves a user with the specified userId
router.get("/:userId", auth, getUser);

// POST /users - Create a new user (open route)
router.post("/", createUser);

// Export the router so it can be used in the main application file
module.exports = router;
