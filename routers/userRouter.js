const {
    followOrUnfollowUserController,
    getPostOfFollowing,
} = require("../controllers/UserController");
const requireUser = require("../middlewares/requireUser");
const router = require("express").Router();

router.post("/follow", requireUser, followOrUnfollowUserController);
router.get("/getPostOfFollowing", requireUser, getPostOfFollowing);

module.exports = router;
