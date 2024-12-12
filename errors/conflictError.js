class ConflictError extends Error {
  constructor(message = "Conflict") {
    super(message, 409);
    this.statusCode = 409;
  }
}

module.exports = ConflictError;
