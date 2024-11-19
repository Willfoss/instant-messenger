const { authorise } = require("../middleware/auth");
const { accessChat, getAllChatsForUser, postGroupChat, patchGroupName } = require("../controllers/chat-controller");

const chatRouter = require("express").Router();

chatRouter.route("/").post(authorise, accessChat);
chatRouter.route("/").get(authorise, getAllChatsForUser);
chatRouter.route("/groups").post(authorise, postGroupChat);
chatRouter.route("/groups").patch(authorise, patchGroupName);
// chatRouter.route("/group/remove").patch(authorise, deleteFromGroup);
// chatRouter.route("/group/add").patch(authorise, patchGroupMember);

module.exports = chatRouter;
