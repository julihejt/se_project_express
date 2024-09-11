const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const {
  OK,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  DUPLICATE_ERROR,
  UNAUTHORIZED_ERROR_CODE,
  BadRequest,
  InternalServerError,
  NotFoundError,
  DuplicateError,
  UnauthorizedError,
} = require("../utils/errors");

// Create a new user
const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  // Check if email or password are missing
  if (!email || !password) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Email and password are required" });
  }

  // Check if email already exists
  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        return res
          .status(DUPLICATE_ERROR)
          .send({ message: "Email is already registered" });
      }

      // Hash the password
      return bcrypt.hash(password, 10);
    })
    .then((hashedPassword) => {
      // Create a new user with the hashed password
      return User.create({ name, avatar, email, password: hashedPassword });
    })
    .then((user) => {
      res.status(201).send({
        name: user.name,
        avatar: user.avatar,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid data from createUser" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Internal Server Error from createUser" });
    });
};

// Get all users
const getUsers = (req, res) => {
  User.find()
    .then((users) => res.status(OK).send(users))
    .catch((err) => {
      console.error(err);
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Internal Server Error from getUsers" });
    });
};

// Get a single user by ID
const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail(new Error("NotFound"))
    .then((user) => res.status(OK).send(user))
    .catch((err) => {
      if (err.message === "NotFound") {
        return res
          .status(NOT_FOUND)
          .send({ message: `${NotFoundError} from getUser` });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: `${BadRequest} from getUser` });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: `${InternalServerError} from getUser` });
    });
};

// Login controller
const login = (req, res) => {
  const { email, password } = req.body;

  // Check if email or password is missing
  if (!email || !password) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Email and password are required" });
  }

  // Find user by email and include the password field in the result
  User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return res
          .status(UNAUTHORIZED_ERROR_CODE)
          .send({ message: "Invalid email or password" });
      }

      // Compare the provided password with the hashed password in the database
      return bcrypt.compare(password, user.password).then((isMatch) => {
        if (!isMatch) {
          return res
            .status(UNAUTHORIZED_ERROR_CODE)
            .send({ message: "Invalid email or password" });
        }

        // Create and send the JWT token
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        });
        return res.send({ token });
      });
    })
    .catch((err) => {
      console.error(err);
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Internal Server Error from login" });
    });
};

// Update user
const updateUser = (req, res) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail(new Error("NotFound"))
    .then((user) => res.status(OK).send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid data from updateUser" });
      }
      if (err.message === "NotFound") {
        return res
          .status(NOT_FOUND)
          .send({ message: `${NotFoundError} from updateUser` });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: `${InternalServerError} from updateUser` });
    });
};

// Export the controller functions
module.exports = {
  createUser,
  getUsers,
  getUser,
  login,
  updateUser,
};
