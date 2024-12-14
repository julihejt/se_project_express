const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const { OK } = require("../utils/errors");

// Define error classes
const BadRequestError = require("../errors/badRequestError");
const NotFoundError = require("../errors/notFoundError");
const UnauthorizedError = require("../errors/unauthorizedError");
const DuplicateError = require("../errors/conflictError");

// Create a new user
const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Email and password are required"));
  }

  return User.findOne({ email }) // Added `return`
    .then((existingEmail) => {
      if (existingEmail) {
        throw new DuplicateError("User with this email already exists");
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
        return next(new BadRequestError("Invalid user data"));
      }
      if (err.code === 11000) {
        return next(new DuplicateError("User with this email already exists"));
      }
      return next(err); // Added `return`
    });
};

// Get a single user by ID
const getUser = (req, res, next) =>
  User.findById(req.user._id) // Added `return`
    .orFail(() => {
      throw new NotFoundError("User not found");
    })
    .then((user) => res.status(OK).send(user))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid user ID"));
      }
      return next(err); // Added `return`
    });

// Login controller
const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Email and password are required"));
  }

  return User.findOne({ email }) // Added `return`
    .select("+password")
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError("Invalid email or password");
      }

      return bcrypt.compare(password, user.password).then((isValid) => {
        if (!isValid) {
          throw new UnauthorizedError("Invalid email or password");
        }

        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        });

        return res.status(200).send({
          // Added `return`
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
    .catch(
      (err) => next(err) // Added `return`
    );
};

// Update user
const updateUser = (req, res, next) => {
  const { name, avatar } = req.body;

  return User.findByIdAndUpdate(
    // Added `return`
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      throw new NotFoundError("User not found");
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid user data"));
      }
      return next(err); // Added `return`
    });
};

// Export the controller functions
module.exports = {
  createUser,
  getUser,
  login,
  updateUser,
};
