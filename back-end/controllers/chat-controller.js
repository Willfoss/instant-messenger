const { getAccessChat } = require("../services/chat-services");

function accessChat(request, response, next) {
  const { user_id } = request.body;
  const { user } = request;
  getAccessChat(user_id, user)
    .then((chat) => {
      response.status(201).send({ chat });
    })
    .catch((error) => {
      next(error);
    });
}

module.exports = { accessChat };
