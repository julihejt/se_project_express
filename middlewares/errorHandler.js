const errorHandler = (err, req, res, net) => {
  console.log(err);
  const { statusCode = 500, message = "An error occurred on the server" } = err;
  return res.status(statusCode).send({
    message,
  });
};

module.exports = errorHandler;