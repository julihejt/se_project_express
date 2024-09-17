// Import the Express Router to handle routing for user-related endpoints
const router = require("express").Router();

// Import the controller functions for user operations
const { getUser, updateUser } = require("../controllers/users");

const auth = require("../middlewares/auth"); // Middleware for authorization

// GET /users/me - Retrieves the current logged-in user data
router.get("/me", auth, getUser);

// PATCH /users/me - Updates the profile of the current logged-in user
router.patch("/me", auth, updateUser);

// Export the router so it can be used in the main application file
module.exports = router;
