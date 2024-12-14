const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const { getUser, updateUser } = require("../controllers/users");
const auth = require("../middlewares/auth");

// Validation schema for updating user profile
const updateUserSchema = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    avatar: Joi.string().uri().optional(),
  }),
});

// GET /users/me - Retrieves the current logged-in user data
router.get("/me", auth, getUser);

// PATCH /users/me - Updates the profile of the current logged-in user
router.patch("/me", auth, updateUserSchema, updateUser);

// Export the router so it can be used in the main application file
module.exports = router;
