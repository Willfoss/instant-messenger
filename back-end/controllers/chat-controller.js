const { getAccessChat, fetchAllChatsForUser, createGroupChat } = require("../services/chat-services");

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

function getAllChatsForUser(request, response, next) {
  const { user } = request;
  fetchAllChatsForUser(user)
    .then((chats) => {
      response.send({ chats });
    })
    .catch((error) => {
      next(error);
    });
}

function postGroupChat(request, response, next) {
  const { users, group_name } = request.body;
  const { user } = request;

  console.log(users, group_name, user);
  createGroupChat(users, group_name, user)
    .then((groupChat) => {
      response.status(201).send({ groupChat });
    })
    .catch((error) => {
      next(error);
    });
}

module.exports = { accessChat, getAllChatsForUser, postGroupChat };
