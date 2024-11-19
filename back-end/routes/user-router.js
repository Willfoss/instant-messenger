const userRouter = require("express").Router();
const { postNewUser, loginUser, getAllUsers } = require("../controllers/user-controllers");
const { authorise } = require("../middleware/auth");

userRouter.route("/").post(postNewUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/").get(authorise, getAllUsers);

module.exports = userRouter;
