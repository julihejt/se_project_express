const ClothingItem = require("../models/clothingItems");
const {
  OK,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  BadRequest,
  InternalServerError,
  NotFoundError,
  AccessDeniedError,
} = require("../utils/errors");

// Create a new clothing item
const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  return ClothingItem.create({
    name,
    weather,
    imageUrl,
    owner: req.user._id,
  })
    .then((item) => {
      return res.status(201).send({ data: item });
    })
    .catch((err) => {
      // Handle validation errors correctly
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).json({ message: "Invalid data" });
      }

      // Any other error
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
    });
};

// Get all clothing items
const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(OK).send(items))
    .catch(() =>
      res.status(INTERNAL_SERVER_ERROR).send({ message: InternalServerError })
    );
};

// Update a clothing item
const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageUrl } }, { new: true })
    .orFail()
    .then((item) => res.status(OK).send({ data: item }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: BadRequest });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: InternalServerError });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  ClothingItem.findById(itemId)
    .orFail() // Ensures the item exists or throws an error
    .then((item) => {
      // Check if the user owns the item
      if (item.owner.toString() !== userId) {
        const error = new Error();
        error.name = "Access Denied";
        throw error; // Throws error if user doesn't own the item
      }
      return ClothingItem.findByIdAndDelete(itemId); // Deletes the item
    })
    .then(() => res.send({ message: '"Item successfully deleted"' })) // Success response
    .catch((err) => {
      if (err.name === "Access Denied") {
        return res
          .status(ACCESS_DENIED_ERROR)
          .send({ message: "Access Denied to delete this item" });
      }
      if (err.name === "ValidationError" || err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Bad request while deleting item" });
      }
      if (err.name === "Error Document Not Found ") {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "International Server Error" });
    });
};

// Like a clothing item
const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: NotFoundError });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: BadRequest });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: InternalServerError });
    });
};

// Dislike a clothing item
const dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: NotFoundError });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: BadRequest });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: InternalServerError });
    });
};

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
  ClothingItem,
};
