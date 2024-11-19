const { request } = require("../app");
const { Chat } = require("../models/chat-models");
const { User } = require("../models/user-model");

async function getAccessChat(user_id, user) {
  if (!user_id) {
    return Promise.reject({ status: 400, message: "User ID not sent with request" });
  }

  return Chat.find({
    isGroupChat: false,
    $and: [{ users: { $elemMatch: { $eq: user._id } } }, { users: { $elemMatch: { $eq: user_id } } }],
  })
    .populate("users", "-password")
    .populate("latestMessage")
    .then((isChat) => {
      return User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name, picture, email",
      });
    })
    .then((chat) => {
      if (chat.length > 0) {
        return Promise.all([chat, 1]);
      } else {
        return { chatName: "sender", isGroupChat: false, users: [user._id, user_id] };
      }
    })
    .then((chatData) => {
      if (Array.isArray(chatData)) {
        return Promise.all(chatData);
      } else {
        return Chat.create(chatData);
      }
    })
    .then((createdChat) => {
      if (Array.isArray(createdChat)) {
        return createdChat[0][0];
      } else {
        return Chat.findOne({ _id: createdChat._id }).populate("users", "-password");
      }
    })
    .then((fullChat) => {
      return fullChat;
    })
    .catch((error) => {
      if (error.kind === "ObjectId") {
        return Promise.reject({ status: 404, message: "No user found" });
      }
    });
}

module.exports = { getAccessChat };
