const ClothingItem = require("../models/clothingItems");
const { OK, handleErrors } = require("../utils/errors"); // Import custom errors

const ForbiddenError = require("../errors/forbiddenError");
// Create a new clothing item
const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({
    name,
    weather,
    imageUrl,
    owner: req.user._id, // The authenticated user's ID
  })
    .then((item) => res.status(OK).send({ data: item }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data"));
      }
      handleErrors(err, next); // Pass to centralized error handler
    });
};

// Get all clothing items
const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(OK).send(items))
    .catch((err) => next(new InternalServerError("Failed to fetch items")));
};

// Delete a clothing item
const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  ClothingItem.findById(itemId)
    .orFail(() => {
      throw new NotFoundError("Item not found");
    })
    .then((item) => {
      if (item.owner.toString() !== userId) {
        throw new ForbiddenError("Access denied");
      }
      return ClothingItem.findByIdAndDelete(itemId);
    })
    .then(() => res.send({ message: "Item successfully deleted" }))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item ID"));
      }
      handleErrors(err, next);
    });
};

// Like a clothing item
const likeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      throw new NotFoundError("Item not found");
    })
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item ID"));
      }
      handleErrors(err, next);
    });
};

// Dislike a clothing item
const dislikeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      throw new NotFoundError("Item not found");
    })
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item ID"));
      }
      handleErrors(err, next);
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
