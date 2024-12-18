const express = require("express");
const apiRouter = require("./routes/api-router");
const { customErrorHandler, serverErrorHandler } = require("./middleware/errorHandling");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());

app.use(express.json());

app.get("/", (request, response) => {
  response.send("API WORKING");
});

app.use("/api", apiRouter);

app.all("*", (request, response) => {
  response.status(404).send({ message: "This path does not exist" });
});

app.use(customErrorHandler);
app.use(serverErrorHandler);

module.exports = app;
