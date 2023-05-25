const {
    signupController,
    loginController,
    refreshAccessTokenController,
} = require("../controllers/authController");

const router = require("express").Router();

router.post("/signup", signupController);
router.get("/login", loginController);
router.post("/refresh", refreshAccessTokenController);

module.exports = router;