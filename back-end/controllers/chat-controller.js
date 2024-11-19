const { getAccessChat, fetchAllChatsForUser, createGroupChat, updateGroupName } = require("../services/chat-services");

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

  createGroupChat(users, group_name, user)
    .then((groupChat) => {
      response.status(201).send({ groupChat });
    })
    .catch((error) => {
      next(error);
    });
}

function patchGroupName(request, response, next) {
  const { group_name, group_id } = request.body;
  updateGroupName(group_name, group_id)
    .then((groupChat) => {
      response.send({ groupChat });
    })
    .catch((error) => {
      next(error);
    });
}

module.exports = { accessChat, getAllChatsForUser, postGroupChat, patchGroupName };
