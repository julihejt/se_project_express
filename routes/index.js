const express = require("express");
const router = express.Router();

// Import necessary controllers and routers
const userRouter = require("./users");
const { login, createUser } = require("../controllers/users");
const itemRouter = require("./clothingItems");

// Import error utility for custom error messages
const {
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  NotFoundError,
} = require("../utils/errors");

// Use routers for routes
router.use("/items", itemRouter);
router.use("/users", userRouter);

// Signin and Signup routes
router.post("/signin", login);
router.post("/signup", createUser);

// 404 Route Handler (for undefined routes)
router.use((req, res) => {
  res.status(NOT_FOUND).json({ message: "Resource not found" });
});

// Error Handling Middleware
router.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack for debugging
  res
    .status(INTERNAL_SERVER_ERROR || 500)
    .json({ message: "Internal Server Error" });
});

module.exports = router;
