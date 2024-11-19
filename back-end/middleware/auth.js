const jwt = require("jsonwebtoken");
const { User } = require("../models/user-model.js");

function authorise(request, response, next) {
  let token;

  if (request.headers.authorization && request.headers.authorization.startsWith("Bearer ")) {
    token = request.headers.authorization.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return User.findById(decoded.id)
      .select("-password")
      .then((user) => {
        request.user = user;
        next();
      })
      .catch((error) => {
        response.status(401).send({ message: "User not authorised" });
      });
  }

  if (!token) {
    response.status(401).send({ message: "User not authorised" });
  }
}

module.exports = { authorise };
