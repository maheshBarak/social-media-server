const {
    updatePostController,
    createPostController,
    LikeAndUnlikePost,
    deletePost,
} = require("../controllers/postsController");
const router = require("express").Router();
const requireUser = require("../middlewares/requireUser");

router.post("/", requireUser, createPostController);
router.post("/like", requireUser, LikeAndUnlikePost);
router.put("/", requireUser, updatePostController);
router.delete("/", requireUser, deletePost);

module.exports = router;
