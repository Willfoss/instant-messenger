const bcrypt = require("bcrypt");

const userData = {
  users: [
    {
      name: "will fossard",
      email: "willfossard@outlook.com",
      password: bcrypt.hashSync("password123", 10),
    },
    {
      name: "bob marley",
      email: "bob_marley@outlook.com",
      password: bcrypt.hashSync("password234", 10),
    },
  ],
};

module.exports = userData;
