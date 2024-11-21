function customErrorHandler(error, request, response, next) {
  if (error.status) {
    response.status(error.status).send({ message: error.message });
  } else {
    next(error);
  }
}

function serverErrorHandler(error, request, response, next) {
  response.status(500).send({ message: "Internal server error" });
}

module.exports = { customErrorHandler, serverErrorHandler };
