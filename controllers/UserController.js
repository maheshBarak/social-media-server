const Post = require("../models/Post");
const User = require("../models/User");
const { error, success } = require("../utils/responseWrapper");

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
        });
        // meaning --> total posts k ander jin bhi posts ki owner id user ki followings id se match hoti h, sirf whi posts show ho

        return res.send(success(200, posts));
    } catch (e) {
        return res.send(error(500, e.message));
    }
};

module.exports = {
    followOrUnfollowUserController,
    getPostOfFollowing,
    //getMyPosts
    //getUserPosts
    //deleteMyProfile
};
