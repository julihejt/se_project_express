class NotFoundError extends Error {
  constructor(message = "Not Found") {
    super(message, 404);
  }
}

module.exports = NotFoundError;
