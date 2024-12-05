const { postMessage, fetchAllMessagesInChat } = require("../services/message-services");

function sendMessage(request, response, next) {
  const { message, chat_id } = request.body;
  const { user } = request;
  postMessage(message, chat_id, user)
    .then((message) => {
      response.status(201).send({ message });
    })
    .catch((error) => {
      next(error);
    });
}

function getAllMessagesInChat(request, response, next) {
  const { chat_id } = request.params;
  const { user } = request;

  fetchAllMessagesInChat(chat_id, user)
    .then((messages) => {
      response.send({ messages });
    })
    .catch((error) => {
      next(error);
    });
}

module.exports = { sendMessage, getAllMessagesInChat };
