const messageRouter = require("express").Router();
const { authorise } = require("../middleware/auth");
const { sendMessage, getAllMessagesInChat } = require("../controllers/message-controllers");

messageRouter.route("/").post(authorise, sendMessage);
messageRouter.route("/:chat_id").get(authorise, getAllMessagesInChat);

module.exports = messageRouter;
