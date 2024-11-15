const { User } = require("../models/user-model");
const bcrypt = require("bcrypt");
const generateToken = require("../config/generateToken");

function addNewUser(name, email, password, picture) {
  const hashedPassword = bcrypt.hashSync(password, 10);

  if (!name || !email || !password) {
    return Promise.reject({ status: 400, message: "Bad Request: name, email and password are all required" });
  }

  if (typeof name !== "string" || typeof email !== "string" || typeof password !== "string") {
    return Promise.reject({ status: 400, message: "Bad Request: Incorrect datatype provided" });
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
      return newUser.save().then((user) => {
        const response = { ...user };
        response._doc.token = generateToken(user._id);
        return response._doc;
      });
    }
  });
}

function authUser(email, password) {
  if (!email || !password) {
    return Promise.reject({ status: 400, message: "Both email and password are required" });
  }

  return User.findOne({ email }).then((user) => {
    if (!user) {
      return Promise.reject({ status: 401, message: "Invalid email address or password" });
    }
    return Promise.all([user, bcrypt.compare(password, user.password)]).then(([user, isPasswordAmatch]) => {
      if (user && isPasswordAmatch === true) {
        const response = { ...user };
        response._doc.token = generateToken(user._id);
        return response._doc;
      } else {
        return Promise.reject({ status: 401, message: "Invalid email address or password" });
      }
    });
  });
}

module.exports = { addNewUser, authUser };
