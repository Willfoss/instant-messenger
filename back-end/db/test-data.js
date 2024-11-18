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
    { name: "will foster", email: "willfoster@email.com", password: bcrypt.hashSync("password123", 10) },
    { name: "will hazel", email: "hazel@email.com", password: bcrypt.hashSync("password123", 10) },
    { name: "jennie", email: "jennie@email.com", password: bcrypt.hashSync("password123", 10) },
  ],
};

module.exports = userData;
