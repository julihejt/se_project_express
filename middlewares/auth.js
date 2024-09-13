// auth.js
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UNAUTHORIZED_ERROR_CODE } = require("../utils/errors");

// Middleware function to authenticate the user using JWT
const auth = (req, res, next) => {
  const { authorization } = req.headers;

  // Check if the Authorization header is present and formatted correctly
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(UNAUTHORIZED_ERROR_CODE)
      .send({ message: "Authorization required" }); // Fixed message
  }

  // Extract the token from the Authorization header
  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    // Verify the JWT and extract the payload
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error("JWT verification failed:", err); // Log the error for debugging
    return res
      .status(UNAUTHORIZED_ERROR_CODE)
      .send({ message: "Invalid token" }); // Fixed message
  }

  // Attach the decoded payload (user information) to req.user
  req.user = payload;

  // Proceed to the next middleware or route handler
  return next();
};

module.exports = auth;
