const mongoose = require("mongoose");
const { User } = require("../models/user-model");
const userTestData = require("./test-data");

const seed = async () => {
  await mongoose.connection.dropDatabase();

  const users = await User.insertMany(userTestData.users, { runValidators: true });

  console.log("seeded successfully");
  return { users };
};

module.exports = { seed };
