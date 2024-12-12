const errorHandler = (err, req, res, next) => {
  console.error(err); // Log the full error for debugging purposes

  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? "An error occurred on the server" : message,
  });
};

module.exports = errorHandler;
