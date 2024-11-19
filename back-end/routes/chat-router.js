const { authorise } = require("../middleware/auth");
const { accessChat, getAllChatsForUser, postGroupChat, patchGroupName, addGroupMember } = require("../controllers/chat-controller");

const chatRouter = require("express").Router();

chatRouter.route("/").post(authorise, accessChat);
chatRouter.route("/").get(authorise, getAllChatsForUser);
chatRouter.route("/groups").post(authorise, postGroupChat);
chatRouter.route("/groups").patch(authorise, patchGroupName);
chatRouter.route("/groups/add").patch(authorise, addGroupMember);
// chatRouter.route("/group/remove").patch(authorise, deleteFromGroup);

module.exports = chatRouter;
