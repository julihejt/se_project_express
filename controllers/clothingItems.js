const ClothingItem = require("../models/clothingItems");
const {
  OK,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  BadRequest,
  InternalServerError,
  NotFoundError,
} = require("../utils/errors");

// Create a new clothing item
const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  if (!req.user || !req.user._id) {
    return res
      .status(401) // Unauthorized
      .send({ message: "Authorization required" });
  }

  ClothingItem.create({
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
    .orFail(new Error("Not Found")) // Throw a clear 'Not Found' error
    .then((item) => {
      if (item.owner.toString() !== userId) {
        const error = new Error("Access Denied");
        throw error;
      }
      return ClothingItem.findByIdAndDelete(itemId); // Deletes the item
    })
    .then(() => res.status(200).json({ message: "Item successfully deleted" }))
    .catch((err) => {
      // More explicit error handling
      if (err.message === "Access Denied") {
        return res
          .status(403)
          .json({ message: "Access Denied to delete this item" });
      }
      if (err.message === "Not Found") {
        return res.status(404).json({ message: "Item not found" });
      }
      if (err.name === "ValidationError" || err.name === "CastError") {
        return res
          .status(400)
          .json({ message: "Bad request while deleting item" });
      }
      return res.status(500).json({ message: "Internal Server Error" });
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
