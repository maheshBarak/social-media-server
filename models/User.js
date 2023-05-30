const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        requires: true,
        select: false,
    },
    name: {
        type: String,
        required: true,
    },
    avatar: {
        //  user profile
        publicId: String,
        url: String,
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
    ],
    followings: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
    ],
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "post",
        },
    ],
});

module.exports = mongoose.model("user", userSchema); // user ---> iss schema ka naam in mongodb files
