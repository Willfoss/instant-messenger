const { request } = require("../app");
const { Chat } = require("../models/chat-models");
const { User } = require("../models/user-model");

function getAccessChat(user_id, user) {
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
        select: "name picture email",
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

function fetchAllChatsForUser(user) {
  return Chat.find({ users: { $elemMatch: { $eq: user._id } } })
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate("latestMessage")
    .sort({ updatedAt: -1 })
    .then((chats) => {
      if (!chats) {
        return [];
      } else {
        return User.populate(chats, {
          path: "latestMessage.sender",
          select: "name picture email",
        });
      }
    });
}

function createGroupChat(users, group_name, user) {
  if (!users || !group_name) {
    return Promise.reject({ status: 400, message: "All fields must be filled in" });
  }

  if (users.length < 2) {
    return Promise.reject({ status: 400, message: "More than two users are required to create a group chat" });
  }

  users.push(user);

  return Chat.create({
    chatName: group_name,
    users: users,
    isGroupChat: true,
    groupAdmin: user,
  }).then((groupchat) => {
    return Chat.findOne({ _id: groupchat._id }).populate("users", "-password").populate("groupAdmin", "-password");
  });
}

function updateGroupName(group_chat_name, group_chat_id) {
  if (!group_chat_name || !group_chat_id) {
    return Promise.reject({ status: 400, message: "A group name and group id must be included" });
  }
  return Chat.findById(group_chat_id)
    .then((chat) => {
      if (!chat) {
        return Promise.reject({ status: 404, message: "This group chat does not exist" });
      }
      if (chat.isGroupChat === false) {
        return Promise.reject({ status: 400, message: "Only a group chat can be renamed" });
      } else {
        return Chat.findByIdAndUpdate(group_chat_id, { chatName: group_chat_name }, { new: true })
          .populate("users", "-password")
          .populate("groupAdmin", "-password");
      }
    })
    .then((groupChat) => {
      return groupChat;
    });
}

function updateGroupMember(group_chat_id, user_to_add) {
  if (!group_chat_id || !user_to_add) {
    return Promise.reject({ status: 400, message: "Must provide both users to add and the chat id" });
  }

  return Chat.findById(group_chat_id)
    .then((chat) => {
      if (!chat) {
        return Promise.reject({ status: 404, message: "This group chat does not exist" });
      }
      if (chat.isGroupChat === false) {
        return Promise.reject({ status: 400, message: "Only a group chat can add users" });
      } else {
        return Chat.findByIdAndUpdate(group_chat_id, { $push: { users: user_to_add } }, { new: true })
          .populate("users", "-password")
          .populate("groupAdmin", "-password");
      }
    })
    .then((updatedGroupChat) => {
      return updatedGroupChat;
    });
}

function removeGroupMember(group_chat_id, user_to_remove) {
  if (!group_chat_id || !user_to_remove) {
    return Promise.reject({ status: 400, message: "Must provide both user to remove and the chat id" });
  }

  return Chat.findById(group_chat_id)
    .then((chat) => {
      if (!chat) {
        return Promise.reject({ status: 404, message: "This group chat does not exist" });
      }
      if (chat.isGroupChat === false) {
        return Promise.reject({ status: 400, message: "Only a group chat can remove users" });
      }
      if (chat.isGroupChat === false) {
        return Promise.reject({ status: 400, message: "Only a group chat can remove users" });
      } else {
        return Chat.findByIdAndUpdate(group_chat_id, { $pull: { users: user_to_remove } }, { new: true })
          .populate("users", "-password")
          .populate("groupAdmin", "-password");
      }
    })
    .then((updatedGroupChat) => {
      return updatedGroupChat;
    });
}

module.exports = { getAccessChat, fetchAllChatsForUser, createGroupChat, updateGroupName, updateGroupMember, removeGroupMember };
