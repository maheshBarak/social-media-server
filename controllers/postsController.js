const { success } = require("../utils/responseWrapper");

const getAllPostsController = (req, res) => {
    console.log(req._id);
    //  res.status(200).send("All posts");
    return res.send(success(200, "All Posts"));
};

module.exports = { getAllPostsController };
