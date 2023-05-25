const { getAllPostsController } = require("../controllers/postsController");
const router = require("express").Router();
const requireUser = require("../middlewares/requireUser");

router.get("/all", requireUser, getAllPostsController);

module.exports = router;
