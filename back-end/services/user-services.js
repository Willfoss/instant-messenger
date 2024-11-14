const { User } = require("../models/user-model");
const bcrypt = require("bcrypt");

function addNewUser(name, email, password, picture) {
  const hashedPassword = bcrypt.hashSync(password, 10);

  if (!name || !email || !password) {
    return Promise.reject({ status: 400, message: "Bad Request: name, email and password are all required" });
  }

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    picture,
  });

  return newUser.save();
}

module.exports = { addNewUser };
