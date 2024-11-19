const apiRouter = require("express").Router();
const userRouter = require("./user-router");
const chatRouter = require("./chat-router");

apiRouter.use("/users", userRouter);
apiRouter.use("/chats", chatRouter);

module.exports = apiRouter;
