// Import the User model for performing database operations on users
const User = require("../models/user");

// Import common error codes for handling different types of errors
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");

// Controller to get all users from the database
const getUsers = (req, res) => {
  User.find({}) // Fetch all users
    .then((users) => {
      // If successful, send back the list of users
      res.send(users);
    })
    .catch((err) => {
      // Log the error details for debugging
      console.error(err);
      // Respond with an internal server error if something goes wrong
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

// Controller to create a new user
const createUser = (req, res) => {
  const { name, avatar } = req.body; // Extract name and avatar from the request body

  // Create a new User document based on the provided data
  User.create({ name, avatar })
    .then((user) => {
      // Send back the newly created user and set the status to 201 (Created)
      res.status(201).send(user);
    })
    .catch((err) => {
      // Log the error details for debugging
      console.error(err);

      // Handle validation errors, e.g., missing required fields
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid data" });
      }

      // For any other errors, respond with an internal server error
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

// Controller to get a single user by their ID
const getUser = (req, res) => {
  const { userId } = req.params; // Extract userId from the request parameters

  // Find a user by their ID
  User.findById(userId)
    .orFail() // Automatically throw an error if the user is not found
    .then((user) => {
      // Send back the user data if found
      res.send(user);
    })
    .catch((err) => {
      // Log the error details for debugging
      console.log(err);

      // Handle case where no user is found with the given ID
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Document not found" });
      }

      // Handle invalid ObjectId format (e.g., malformed IDs)
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid data" });
      }

      // For other errors, return an internal server error response
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

// Export the controller functions to be used in other parts of the application
module.exports = { getUsers, createUser, getUser };
