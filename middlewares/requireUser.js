const jwt = require("jsonwebtoken");
const { error } = require("../utils/responseWrapper");
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
        const decoded = jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_PRIVATE_KEY
        );
        req._id = decoded._id;
        console.log("THis is requireUser middleware");
        next();
    } catch (e) {
        console.log(e);
        // return res.status(401).send("Invalid access key");
        return res.send(error(401, "Invalid access key"));
    }
};
