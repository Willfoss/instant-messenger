const mongoose = require("../db/connection");

const UsersSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const usersModel = mongoose.model("users", UsersSchema);

module.exports = { usersModel };
