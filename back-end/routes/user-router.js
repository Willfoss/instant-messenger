const userRouter = require("express").Router();
const { postNewUser } = require("./controllers/user-controller");

router.route("/").post(postNewUser);
router.route("./login").post(loginUser);

module.exports = userRouter;
