const messageRouter = require("express").Router();
const { authorise } = require("../middleware/auth");

//messageRouter.route("/").post(authorise, sendMessage);
// messageRouter.route("/chat_id").get(authorise, getAllMessagesInChat)

module.exports = messageRouter;
