// auth.js
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UnauthorizedError } = require("../utils/errors");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  // if (!authorization || !authorization.startsWith("Bearer ")) {
  // return res
  // .status(UNAUTHORIZED_ERROR_CODE)
  // .send({ message: "Authorization required" });
  // }

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new UnauthorizedError("Authorization required");
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
  } catch (err) {
    throw new UnauthorizedError("Invalid token");
  }

  return next();
};

module.exports = auth;
