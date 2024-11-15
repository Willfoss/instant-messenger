const express = require("express");
const apiRouter = require("./routes/api-router");
const { customErrorHandler, serverErrorHandler } = require("./errorHandling");

const app = express();

app.use(express.json());

app.use("/api", apiRouter);

app.all("*", (request, response) => {
  response.status(404).send({ message: "This path does not exist" });
});

app.use(customErrorHandler);
app.use(serverErrorHandler);

module.exports = app;
