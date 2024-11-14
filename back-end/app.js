const express = require("express");
const { postNewUser } = require("./controllers/user-controller");
const apiRouter = require("./routes/api-router");

const app = express();

app.use(express.json());

app.use("/api", apiRouter);

module.exports = app;
