const { User } = require("../models/user-model");
const bcrypt = require("bcrypt");

function addNewUser(name, email, password, picture) {
  const hashedPassword = bcrypt.hashSync(password, 10);

  if (!name || !email || !password) {
    return Promise.reject({ status: 400, message: "Bad Request: name, email and password are all required" });
  }

  newUser = new User({
    name,
    email,
    password: hashedPassword,
    picture,
  });

  return User.findOne({ email }).then((user) => {
    if (user) {
      return Promise.reject({ status: 200, message: "A user already exists with that email address. Please log in or try again" });
    } else {
      return newUser.save().then(user);
    }
  });
}

module.exports = { addNewUser };
