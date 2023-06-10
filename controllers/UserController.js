const Post = require("../models/Post");
const User = require("../models/User");
const { mapPostOutput } = require("../utils/Utils");
const { error, success } = require("../utils/responseWrapper");
const cloudinary = require("cloudinary").v2;

const followOrUnfollowUserController = async (req, res) => {
    try {
        const { userIdToFollow } = req.body;
        const curUserId = req._id; // requireUser middleware me se milega,

        const userToFollow = await User.findById(userIdToFollow);
        const curUser = await User.findById(curUserId);

        if (curUserId === userIdToFollow) {
            return res.send(error(409, "User cannot follow themself"));
        }

        if (!userToFollow) {
            return res.send(error(404, "User to follow not found"));
        }
        if (curUser.followings.includes(userIdToFollow)) {
            // user already follows, therefore it will unfollow by pressing same button
            // user ki following array ka index
            const followingIndex = curUser.followings.indexOf(userIdToFollow);
            curUser.followings.splice(followingIndex, 1);

            // user jisko follow ya unfollow kr rha h, uski following ka index
            const followersIndex = userToFollow.followers.indexOf(curUserId);
            userToFollow.followers.splice(followersIndex, 1);

            await userToFollow.save();
            await curUser.save();

            return res.send(success(200, "User Unfollowed"));
        } else {
            userToFollow.followers.push(curUserId);
            curUser.followings.push(userIdToFollow);

            await userToFollow.save();
            await curUser.save();

            return res.send(success(200, "User Followed"));
        }
    } catch (e) {
        // console.log(e);
        return res.send(error(500, e.message));
    }
};

const getPostOfFollowing = async (req, res) => {
    try {
        const curUserId = req._id;
        const curUser = await User.findById(curUserId);

        const posts = await Post.find({
            owner: {
                $in: curUser.followings,
            },
        }).populate("likes");
        // meaning --> total posts k ander jin bhi posts ki owner id user ki followings id se match hoti h, sirf whi posts show ho

        return res.send(success(200, posts));
    } catch (e) {
        return res.send(error(500, e.message));
    }
};

const getSpecificUserPosts = async (req, res) => {
    try {
        const { userId } = req.body;
        const curUserId = req._id;

        const user = await User.findById(userId);
        const curUser = await User.findById(curUserId);

        if (!user) {
            return res.send(error(404, "User not found"));
        }
        if (curUser.followings.includes(userId)) {
            const posts = await Post.find({
                owner: userId,
            }).populate("likes");
            return res.send(success(200, posts));
        }
        return res.send(success(401, "Follow to see the post of User"));
    } catch (e) {
        return res.send(error(500, e.message));
    }
};
const deleteMyProfile = async (req, res) => {
    try {
        const curUserId = req._id;
        const curUser = await User.findById(curUserId);

        //      **********     5 TASKS      **********

        // apni saari posts delete hogi
        await Post.deleteMany({
            owner: curUserId,
        });

        //    console.log(curUser.followers.length);
        // apne followers ki following list se apni delete krni h
        curUser.followers.forEach(async (followerId) => {
            const follower = await User.findById(followerId);
            const index = follower.followings.indexOf(curUserId);
            follower.followings.splice(index, 1);
            await follower.save();
        });

        // mere following ki followers list se apni delete krni h
        curUser.followings.forEach(async (followingId) => {
            const following = await User.findById(followingId);
            const index = following.followers.indexOf(curUserId);
            following.followers.splice(index, 1);
            await following.save();
        });

        // remove myself from all posts that i liked.
        const allPosts = await Post.find();
        allPosts.forEach(async (post) => {
            const index = post.likes.indexOf(curUserId);
            post.likes.splice(index, 1);
            await post.save();
        });

        // deleting the acount
        await curUser.remove();

        // deleting refresh token
        res.clearCookie("jwt", {
            httpOnly: true,
            secure: true,
        });

        return res.send(success(200, "user deleted"));
    } catch (e) {
        //   console.log(e);
        return res.send(error(500, e.message));
    }
};

const getMyProfile = async (req, res) => {
    try {
        const userId = req._id;
        const user = await User.findById(userId);
        return res.send(success(200, { user }));
    } catch (e) {
        return res.send(error(500, e.message));
    }
};
const updateUserProfile = async (req, res) => {
    try {
        const { name, bio, userImg } = req.body;

        const user = await User.findById(req._id);
        if (name) {
            user.name = name;
        }
        if (bio) {
            user.bio = bio;
        }
        if (userImg) {
            const cloudImg = await cloudinary.uploader.upload(userImg, {
                folder: "ProfileImg",
            });
            user.avatar = {
                url: cloudImg.secure_url,
                publicId: cloudImg.public_id,
            };
        }
        await user.save();
        return res.send(success(200, { user }));
    } catch (e) {
        return res.send(error(500, e.message));
    }
};

const getUserProfile = async (req, res) => {
    try {
        const userId = req.body.userId;
        const user = await User.findById(userId).populate({
            path: "posts",
            populate: {
                path: "owner",
            },
        });

        const fullPosts = user.posts;
        const posts = fullPosts
            .map((item) => mapPostOutput(item, req._id))
            .reverse();

        return res.send(success(200, { ...user._doc, posts })); // ._doc provides the actual releveant information
    } catch (e) {
        console.log("error put", e);
        return res.send(error(500, e.message));
    }
};
module.exports = {
    followOrUnfollowUserController,
    getPostOfFollowing,
    getSpecificUserPosts,
    deleteMyProfile,
    getMyProfile,
    updateUserProfile,
    getUserProfile,
};
