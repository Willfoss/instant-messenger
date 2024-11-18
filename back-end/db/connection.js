const mongoose = require("mongoose");

const ENV = process.env.NODE_ENV || "development";

require("dotenv").config({
  path: `${__dirname}/../.env.${ENV}`,
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    if (ENV === "test") console.log("Connected to test MongoDB");
    if (ENV === "development") console.log("Connected to dev MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

module.exports = mongoose;
