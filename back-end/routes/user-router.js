const userRouter = require("express").Router();
const { postNewUser, loginUser, getAllUsers } = require("../controllers/user-controllers");
const { protect } = require("../middleware/auth");

userRouter.route("/").post(postNewUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/").get(protect, getAllUsers);

module.exports = userRouter;
