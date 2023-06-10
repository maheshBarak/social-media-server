const jwt = require("jsonwebtoken");
const { error } = require("../utils/responseWrapper");
const User = require("../models/User");
module.exports = async (req, res, next) => {
    if (
        !req.headers ||
        !req.headers.authorization ||
        !req.headers.authorization.startsWith("Bearer")
    ) {
        // return res.status(401).send("Autherization header is required");
        return res.send(error(401, "Autherization header is required"));
    }
    const accessToken = req.headers.authorization.split(" ")[1];
    //   console.log(accessToken);

    try {
        const decodedToken = jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_PRIVATE_KEY
        );
        req._id = decodedToken._id;
        console.log("This is requireUser middleware");

        const user = await User.findById(req._id);

        if (!user) {
            return res.send(error(404, "User not found"));
        }
        next();
    } catch (e) {
        console.log(e);
        // return res.status(401).send("Invalid access key");
        return res.send(error(401, "Invalid access key"));
    }
};
