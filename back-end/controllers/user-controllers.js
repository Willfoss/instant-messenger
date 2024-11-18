const { addNewUser, authUser, fetchAllUsers } = require("../services/user-services");
const bcrypt = require("bcrypt");

function postNewUser(request, response, next) {
  const { name, email, password, picture } = request.body;
  addNewUser(name, email, password, picture)
    .then((user) => {
      response.status(201).send({ user });
    })
    .catch((error) => {
      next(error);
    });
}

function loginUser(request, response, next) {
  const { email, password } = request.body;
  authUser(email, password)
    .then((user) => {
      response.status(201).send({ user });
    })
    .catch((error) => {
      next(error);
    });
}

function getAllUsers(request, response, next) {
  const { search } = request.query;
  const { user } = request;
  fetchAllUsers(search, user)
    .then((users) => {
      response.send({ users });
    })
    .catch((error) => {
      next(error);
    });
}

module.exports = { postNewUser, loginUser, getAllUsers };
