class ForbiddenError extends Error {
  constructor(message = "Forbidden") {
    super(message, 403);
    this.statusCode = 403;
  }
}

module.exports = ForbiddenError;
