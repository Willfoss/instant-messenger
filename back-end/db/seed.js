const mongoose = require("mongoose");
const { User } = require("../models/user-model");
const { Chat } = require("../models/chat-models");
const { userTestData } = require("./test-data");

const seed = async () => {
  await mongoose.connection.dropDatabase();

  const users = await User.insertMany(userTestData.users, { runValidators: true });
  //const chats = await Chat.insertMany(chatTestData.chats, { runValidators: true });

  return { users };
};

module.exports = { seed };
