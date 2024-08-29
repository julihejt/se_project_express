// Import the Express Router to handle routing for clothing items
const router = require("express").Router();

// Import the controller functions for clothing items
const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

// Define the route to create a new clothing item
// POST / - Creates a new clothing item
router.post("/", createItem);

// Define the route to retrieve all clothing items
// GET / - Gets a list of all clothing items
router.get("/", getItems);

// Define the route to delete a clothing item by its ID
// DELETE /:itemId - Deletes the item with the specified ID
router.delete("/:itemId", deleteItem);

// Define the route to like a clothing item
// PUT /:itemId/likes - Adds a like from the current user to the item with the specified ID
router.put("/:itemId/likes", likeItem);

// Define the route to dislike a clothing item
// DELETE /:itemId/likes - Removes a like from the current user for the item with the specified ID
router.delete("/:itemId/likes", dislikeItem);

// Export the router so it can be used in the main application
module.exports = router;
