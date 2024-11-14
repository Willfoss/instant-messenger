function customErrorHandler(error, request, response, next) {
  if (error.status === 200) {
    response.status(error.status).send({ message: error.message });
  }
  if (error.status === 400) {
    response.status(400).send({ message: error.message });
  }
}

function serverErrorHandler(error, request, response, next) {
  console.log(error);
  response.status(500).send({ message: "Internal server error" });
}

module.exports = { customErrorHandler, serverErrorHandler };
