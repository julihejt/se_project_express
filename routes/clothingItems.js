// Import the Express Router to handle routing for clothing items
const router = require("express").Router();
const auth = require("../middlewares/auth");

// Import the controller functions for clothing items
const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

// Public Route - Create a new clothing item (accessible without auth)
router.post("/", createItem);

// Apply auth middleware for protected routes
router.use(auth);

// Protected Routes
router.get("/", getItems);
router.delete("/:itemId", deleteItem);
router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", dislikeItem);

// Export the router so it can be used in the main application
module.exports = router;
