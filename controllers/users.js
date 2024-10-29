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
} = require("../utils/errors");

// Create a new user
const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    return res
      .status(BAD_REQUEST)
      .send({ message: `${BadRequest} from createUser` });
  }

  return User.findOne({ email })
    .then((existingEmail) => {
      if (existingEmail) {
        const error = new Error();
        error.name = "DuplicateError";
        throw error;
      }
      return bcrypt.hash(password, 10);
    })
    .then((hashedPassword) =>
      User.create({ name, avatar, email, password: hashedPassword })
    )
    .then((user) =>
      res.status(201).send({
        name: user.name,
        avatar: user.avatar,
        email: user.email,
      })
    )
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: `${BadRequest} from createUser` });
      }
      if (err.name === "DuplicateError" || err.code === 11000) {
        return res
          .status(DUPLICATE_ERROR)
          .send({ message: `${DuplicateError} from createUser` });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: `${InternalServerError} from createUser` });
    });
};

// Get a single user by ID
const getUser = (req, res) => {
  User.findById(req.user._id)
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

  if (!email || !password) {
    return res
      .status(BAD_REQUEST)
      .send({ message: `${BadRequest} from login` });
  }

  return User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return res
          .status(UNAUTHORIZED_ERROR_CODE)
          .send({ message: "Invalid email or password" });
      }

      return bcrypt.compare(password, user.password).then((isValid) => {
        if (!isValid) {
          return res
            .status(UNAUTHORIZED_ERROR_CODE)
            .send({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        });
        return res.status(200).send({
          token,
          user: {
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            _id: user._id,
          },
        });
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(INTERNAL_SERVER_ERROR).send({ message: "Server error" });
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
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        console.error(err);
        return res
          .status(BAD_REQUEST)
          .send({ message: `${BadRequest} updateUser` });
      }
      if (err.name === "DocumentNotFoundError") {
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
  getUser,
  login,
  updateUser,
};
