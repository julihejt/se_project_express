const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const {
  UNAUTHORIZED_ERROR_CODE,
  UnauthorizedError,
} = require("../utils/errors");

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(UNAUTHORIZED_ERROR_CODE)
      .send({ message: "Authorization required" });
  }

  const token = authorization.replace("Bearer ", "");
  let payload;
  try {
    // Verifying the token
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error(err);
    // Return error if token is invalid
    return res
      .status(UNAUTHORIZED_ERROR_CODE)
      .send({ message: "Invalid token" });
  }

  // Attach the payload (user info) to the request object
  req.user = payload;

  // Proceed to the next middleware
  return next();
};

module.exports = auth;
