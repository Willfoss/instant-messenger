const express = require("express");
const { postNewUser } = require("./controllers/user-controller");

const app = express();

app.use(express.json());

app.post("/api/users", postNewUser);

module.exports = app;
