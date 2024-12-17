const express = require("express");
const apiRouter = require("./routes/api-router");
const { customErrorHandler, serverErrorHandler } = require("./middleware/errorHandling");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());

app.use(express.json());

//deployment

// const __dirname1 = path.resolve();

// console.log(process.env.NODE_ENV);

// if (process.env.NODE_ENV === "development") {
//   app.use(express.static(`${__dirname1}/front-end/dist`));

//   app.get("*", (request, response) => {
//     response.sendFile(`${__dirname1}/front-end/dist/index.html`);
//   });
// } else {
//   app.get("/", (request, response) => {
//     response.send("API WORKING");
//   });
// }

app.use("/api", apiRouter);

app.all("*", (request, response) => {
  response.status(404).send({ message: "This path does not exist" });
});

app.use(customErrorHandler);
app.use(serverErrorHandler);

module.exports = app;
