// Import the Express Router to handle routing for user-related endpoints
const router = require("express").Router();

// Import the controller functions for user operations
const { celebrate, Joi } = require("celebrate"); // For validation
const { getUser, updateUser } = require("../controllers/users");

const auth = require("../middlewares/auth"); // Middleware for authorization

// Validation schema for updating user profile
const updateUserSchema = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
  }),
});

// GET /users/me - Retrieves the current logged-in user data
router.get("/me", auth, getUser);

// PATCH /users/me - Updates the profile of the current logged-in user
router.patch("/me", auth, updateUserSchema, updateUser);

// Export the router so it can be used in the main application file
module.exports = router;
