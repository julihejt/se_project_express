// Import the Express Router to handle routing
const router = require("express").Router();

// Import the NOT_FOUND error code for handling 404 errors
const { NOT_FOUND } = require("../utils/errors");

const itemRouter = require("./clothingItems");

// Use the userRouter for all routes starting with /users
// This will route requests like /users and /users/:userId to the userRouter
router.use("/users", userRouter);

// Use the itemRouter for all routes starting with /items
// This will route requests like /items and /items/:itemId to the itemRouter
router.use("/items", itemRouter);

router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Resource not found" });
});

module.exports = router;
