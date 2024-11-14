const { User } = require("../models/user-model");
const bcrypt = require("bcrypt");

function postNewUser(request, response, next) {
  const { firstName, lastName, email, password } = request.body;

  const hashedPassword = bcrypt.hashSync(password, 10);
  console.log(firstName, lastName, email, password);

  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });

  newUser
    .save()
    .then((user) => {
      response.status(201).send({ user });
    })
    .catch((error) => {
      next(error);
    });
}

module.exports = { postNewUser };
