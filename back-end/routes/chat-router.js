const { authorise } = require("../middleware/auth");
const { accessChat } = require("../controllers/chat-controller");

const chatRouter = require("express").Router();

chatRouter.route("/").post(authorise, accessChat);
// chatRouter.route("/").get(authorise, getChats);
// chatRouter.route("/group").post(authorise, createGroupChat);
// chatRouter.route("/group").patch(authorise, patchGroupName);
// chatRouter.route("/group/remove").patch(authorise, deleteFromGroup);
// chatRouter.route("/group/add").patch(authorise, patchGroupMember);

module.exports = chatRouter;
