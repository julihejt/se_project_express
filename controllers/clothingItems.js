const ClothingItem = require("../models/clothingItems");
const {
  OK,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  ACCESS_DENIED_ERROR,
  BadRequest,
  InternalServerError,
  NotFoundError,
} = require("../utils/errors");

// Create a new clothing item
const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  // Creating the clothing item
  ClothingItem.create({
    name,
    weather,
    imageUrl,
    owner: req.user._id, // The authenticated user's ID
  })
    .then((item) =>
      // Respond with the created item and a 201 status
      res.status(201).send({ data: item })
    )
    .catch((err) => {
      // Handle validation errors (like missing required fields)
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).json({ message: "Invalid data" });
      }

      // Handle other server errors
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
      return ClothingItem.findByIdAndDelete(itemId); //  item
    })
    .then(() => res.send({ message: "Item successfully d" }))
    .catch((err) => {
      if (err.message === "AccessDeniedError") {
        return res
          .status(ACCESS_DENIED_ERROR)
          .send({ message: "Access Denied" });
      }
      if (err.message === "Not Found Error") {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      if (err.message === "Validation Error" || err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid data" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Internal Server Error" });
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
  deleteItem,
  likeItem,
  dislikeItem,
  ClothingItem,
};
