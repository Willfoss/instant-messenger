const { addNewUser } = require("../services/user-services");
const bcrypt = require("bcrypt");

function postNewUser(request, response, next) {
  const { name, email, password, picture } = request.body;
  addNewUser(name, email, password, picture)
    .then((user) => {
      response.status(201).send({ user });
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
}

module.exports = { postNewUser };
