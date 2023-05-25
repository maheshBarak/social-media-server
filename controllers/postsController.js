const getAllPostsController = (req, res) => {
    console.log(req._id);
    res.status(200).send("All posts");
};

module.exports = { getAllPostsController };
