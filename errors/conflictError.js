class ConflictError extends Error {
  constructor(message = "Conflict") {
    super(message, 409);
  }
}

module.exports = ConflictError;
