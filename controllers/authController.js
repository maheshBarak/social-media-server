const User = require("../models/User");
const bcrypt = require("bcrypt"); //for password
const jwt = require("jsonwebtoken");
const { error, success } = require("../utils/responseWrapper");

const signupController = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            // return res.status(400).send("All Fields Required");
            return res.send(error(400, "All Fields Required"));
        }

        const oldUser = await User.findOne({ email });
        if (oldUser) {
            // return res.status(409).send("User is already registered");
            return res.send(error(409, "User is already registered"));
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            email,
            password: hashedPassword,
        });

        /* return res.status(201).json({
            user,
        }); */
        return res.send(
            success(201, {
                user,
            })
        );
    } catch (error) {
        console.log(error);
    }
};

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            // return res.status(400).send("All Fields Required");
            return res.send(error(409, "All Fields Required"));
        }
        const user = await User.findOne({ email });
        if (!user) {
            //  return res.status(404).send("User is not registered");
            return res.send(error(404, "User is not registered"));
        }

        const matched = await bcrypt.compare(password, user.password);
        if (!matched) {
            //  return res.status(403).send("Incorrect Password");
            return res.send(error(403, "Incorrect Password"));
        }

        const accessToken = generateAccessToken({
            _id: user._id,
            //    email: user.email,
        });
        const refreshToken = generateRefreshToken({
            _id: user._id,
        });

        // jwt --> iss cookie ka naam hai,  refreshtoken --> value stored in it
        //  frontend can't access the information inside the cookie
        res.cookie("jwt", refreshToken, {
            httpOnly: true,
            secure: true,
        });
        // return res.json({ accessToken });
        return res.send(success(200, { accessToken }));
    } catch (error) {
        console.log(error);
    }
};

//  this api will check the refreshToken validity and generate a new access token
const refreshAccessTokenController = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies.jwt) {
        // return res.status(401).send("Refresh token in cookie is required");
        return res.send(error(401, "Refresh token in cookie is required"));
    }

    const refreshToken = cookies.jwt;

    console.log("refresh", refreshToken);

    try {
        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_PRIVATE_KEY
        );

        const _id = decoded._id;
        const accessToken = generateAccessToken({ _id });

        return res.send(success(201, { accessToken }));
    } catch (e) {
        console.log(e);
        // return res.status(401).send("Invalid refresh token");
        return res.send(error(401, "Invalid refresh token"));
    }
};

// internal functions not to be export
// ** ** * * * * ** * * ** * * * ** * * ** *** ** * * * * ** * * ** * * * ** * * ** * * * * *//
const generateAccessToken = (data) => {
    try {
        const token = jwt.sign(data, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
            expiresIn: "15m",
        });
        console.log("Access Token", token);
        return token;
    } catch (error) {
        console.log(error);
    }
};

const generateRefreshToken = (data) => {
    try {
        const token = jwt.sign(data, process.env.REFRESH_TOKEN_PRIVATE_KEY, {
            expiresIn: "1y",
        });
        console.log("Refresh Token", token);
        return token;
    } catch (error) {
        console.log(error);
    }
};
// ** ** * * * * ** * * ** * * * ** * * ** * *** ** * * * * ** * * ** * * * ** * * ** * * * *//

module.exports = {
    signupController,
    loginController,
    refreshAccessTokenController,
};
