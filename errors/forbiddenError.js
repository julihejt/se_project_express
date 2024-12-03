class ForbiddenError extends Error {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}

module.exports = ForbiddenError;
