const express = require("express");
const apiRouter = require("./routes/api-router");
const { customErrorHandler, serverErrorHandler } = require("./errorHandling");

const app = express();

app.use(express.json());

app.use("/api", apiRouter);

app.use(customErrorHandler);
app.use(serverErrorHandler);

module.exports = app;
