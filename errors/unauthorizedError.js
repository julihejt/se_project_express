class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message, 401);
    this.statusCode = 401;
  }
}

module.exports = UnauthorizedError;
