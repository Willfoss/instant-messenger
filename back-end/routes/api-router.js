const apiRouter = require("express").Router();
const userRouter = require("./user-router");
const chatRouter = require("./chat-router");
const messageRouter = require("./message-router");

apiRouter.use("/users", userRouter);
apiRouter.use("/chats", chatRouter);
apiRouter.use("/messages", messageRouter);

module.exports = apiRouter;
