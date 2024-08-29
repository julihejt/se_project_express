// Import the ClothingItem model from the models directory
const ClothingItem = require("../models/clothingItems");

// Import error codes for better error management
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");

// Create a new clothing item and associate it with the current user
const createItem = (req, res) => {
  // Extract the item details from the request body
  const { name, weather, imageUrl } = req.body;

  // Create a new ClothingItem document with the data provided and the owner's user ID
  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      // Send back the newly created item as a response
      res.send({ data: item });
    })
    .catch((error) => {
      // Handle validation errors (e.g., missing fields or incorrect data format)
      if (error.name === "ValidationError") {
        res.status(BAD_REQUEST).send({ message: "Validation Error" });
      } else {
        // Handle server errors
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: "An error has occurred on the server" });
      }
    });
};

// Retrieve all clothing items from the database
const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => {
      // Send back the array of clothing items
      res.send(items);
    })
    .catch((err) => {
      // Log any internal server errors and send an error response
      console.error(err);
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

// Delete a clothing item by its ID
const deleteItem = (req, res) => {
  const { itemId } = req.params; // Extract the item ID from the request URL

  // Find the item by ID and delete it
  ClothingItem.findByIdAndDelete(itemId)
    .orFail() // Throw an error if the item is not found
    .then(() => {
      // Respond with a success message
      res.send({ message: "Item successfully deleted" });
    })
    .catch((err) => {
      // Log the error details for debugging
      console.error(`Error ${err.name} with message ${err.message}`);

      // Handle case where the item wasn't found
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Document not found" });
      }
      // Handle case where the item ID is invalid
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid data" });
      }

      // Handle other internal server errors
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

// Like a clothing item by adding the current user's ID to the likes array
const likeItem = (req, res) => {
  // Find the item by its ID and add the user's ID to the likes array
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } }, // Prevent duplicates in the likes array
    { new: true } // Return the updated document
  )
    .orFail() // Throw an error if the item isn't found
    .then((item) => {
      // Respond with the updated item
      res.send({ data: item });
    })
    .catch((err) => {
      // Log the error for debugging
      console.error(`Error ${err.name} with message ${err.message}`);

      // Handle case where the item isn't found
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Document not found" });
      }
      // Handle case where the item ID is invalid
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid data" });
      }

      // Handle other internal server errors
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

// Dislike a clothing item by removing the current user's ID from the likes array
const dislikeItem = (req, res) => {
  // Find the item by its ID and remove the user's ID from the likes array
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // Remove the user's ID from the likes array
    { new: true } // Return the updated document
  )
    .orFail() // Throw an error if the item isn't found
    .then((item) => {
      // Respond with the updated item
      res.send({ data: item });
    })
    .catch((err) => {
      // Log the error details for debugging
      console.error(`Error ${err.name} with message ${err.message}`);

      // Handle case where the item isn't found
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Document not found" });
      }
      // Handle case where the item ID is invalid
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid data" });
      }

      // Handle other internal server errors
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

// Export the CRUD operations as modules for use in other parts of the application
module.exports = { createItem, getItems, deleteItem, likeItem, dislikeItem };
