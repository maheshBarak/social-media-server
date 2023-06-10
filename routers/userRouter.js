const {
    followOrUnfollowUserController,
    getPostOfFollowing,
    getSpecificUserPosts,
    deleteMyProfile,
    getMyProfile,
    updateUserProfile,
    getUserProfile,
} = require("../controllers/UserController");
const requireUser = require("../middlewares/requireUser");
const router = require("express").Router();

router.post("/follow", requireUser, followOrUnfollowUserController);
router.get("/getPostOfFollowing", requireUser, getPostOfFollowing);
router.get("/getMyInfo", requireUser, getMyProfile);
router.post("/singleuserposts", requireUser, getSpecificUserPosts);
router.delete("/deleteAccount", requireUser, deleteMyProfile);
router.put("/", requireUser, updateUserProfile);
router.post("/getUserProfile", requireUser, getUserProfile);
module.exports = router;
