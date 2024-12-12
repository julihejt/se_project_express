const express = require("express");

const router = express.Router();

// Import necessary controllers and routers
const { celebrate, Joi } = require("celebrate");
const userRouter = require("./users");
const { login, createUser } = require("../controllers/users");
const itemRouter = require("./clothingItems");

// Import validation and error utilities
const NotFoundError = require("../utils/errors");

// Validation Schemas
const loginSchema = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6),
  }),
});

const signupSchema = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6),
  }),
});

// Use routers for routes
router.use("/items", itemRouter);
router.use("/users", userRouter);

// Signin and Signup routes with validation
router.post("/signin", loginSchema, login);
router.post("/signup", signupSchema, createUser);

// 404 Route Handler (for undefined routes)
router.use((req, res, next) => {
  next(new NotFoundError("Resource not found"));
});

module.exports = router;
