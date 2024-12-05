const { Chat } = require("../models/chat-models");
const Message = require("../models/message-model");
const { User } = require("../models/user-model");

function postMessage(message, chat_id, user) {
  if (!message || !chat_id) {
    return Promise.reject({ status: 400, message: "Both a message and a valid chat_id are required" });
  }
  const messageObject = {
    sender: user._id,
    content: message,
    chat: chat_id,
  };

  return Message.create(messageObject)
    .then((message) => {
      return message.populate("sender", "name picture");
    })
    .then((message) => {
      return message.populate("chat");
    })
    .then((message) => {
      return User.populate(message, { path: "chat.users", select: "name picture email _id" });
    })
    .then((message) => {
      return Promise.all([
        Chat.findByIdAndUpdate(chat_id, {
          latestMessage: message,
        }),
        message,
      ]);
    })
    .then(([latestMessage, sentMessage]) => {
      return sentMessage;
    });
}

function fetchAllMessagesInChat(chat_id, user) {
  return Message.find({ chat: chat_id })
    .populate("sender", "_id name email picture")
    .populate("chat")
    .then((messages) => {
      return messages;
    });
}

module.exports = { postMessage, fetchAllMessagesInChat };
