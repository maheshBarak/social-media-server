const {
    signupController,
    loginController,
    refreshAccessTokenController,
    logOutController,
} = require("../controllers/authController");

const router = require("express").Router();

router.post("/signup", signupController);
router.post("/login", loginController);
router.get("/refresh", refreshAccessTokenController);
router.post("/logout", logOutController);

module.exports = router;
