class BadRequestError extends Error {
  constructor(message = "Bad Request") {
    super(message, 400);
  }
}

module.exports = BadRequestError;
