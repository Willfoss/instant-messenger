const userRouter = require("express").Router();
const { postNewUser, loginUser } = require("../controllers/user-controllers");

userRouter.route("/").post(postNewUser);
userRouter.route("/login").post(loginUser);

module.exports = userRouter;
