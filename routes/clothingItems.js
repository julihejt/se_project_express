// Import the Express Router to handle routing for clothing items
const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const auth = require("../middlewares/auth");

// Import the controller functions for clothing items
const {
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

// Validation Schemas
const itemId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().hex().length(24).required(),
  }),
});

const createItem = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    weather: Joi.string().valid("hot", "warm", "cold").required(),
    imageUrl: Joi.string().uri().required(),
  }),
});

// Public Route - Get all clothing items
router.get("/", getItems);

// Apply auth middleware for protected routes
router.use(auth);

// Protected Routes
// Create a new clothing item
router.post("/", createItem, createItem);

// Delete a clothing item by ID
router.delete("/:itemId", itemId, deleteItem);

// Like a clothing item by ID
router.put("/:itemId/likes", itemId, likeItem);

// Dislike a clothing item by ID
router.delete("/:itemId/likes", itemId, dislikeItem);

// Export the router so it can be used in the main application
module.exports = router;
