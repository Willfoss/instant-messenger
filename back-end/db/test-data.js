const bcrypt = require("bcrypt");

const userData = {
  users: [
    {
      firstName: "Will",
      lastName: "Fossard",
      email: "willfossard@outlook.com",
      password: bcrypt.hashSync("password123", 10),
    },
    {
      firstName: "bob",
      lastName: "marley",
      email: "bob_marley@outlook.com",
      password: bcrypt.hashSync("password234", 10),
    },
  ],
};

module.exports = userData;
