const express = require("express");

const router = express.Router();
const { celebrate, Joi } = require("celebrate");

const userRouter = require("./users");
const itemRouter = require("./clothingItems");

const { login, createUser } = require("../controllers/users");

const NotFoundError = require("../errors/notFoundError");

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
    avatar: Joi.string().uri().optional(),
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
