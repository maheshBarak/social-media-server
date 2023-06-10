const express = require("express");

const dbConnect = require("./dbConnect");
const dotenv = require("dotenv");
dotenv.config("./.env");
const authRouter = require("./routers/authRouter");
const postRouter = require("./routers/postRouter");
const userRouter = require("./routers/userRouter");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;

const app = express();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// middlewares
app.use(
    cors({
        credentials: true,
        origin: "http://localhost:3000",
    })
);
app.use(express.json({ limit: "10mb" }));
app.use(morgan("common"));
app.use(cookieParser());

const PORT = process.env.PORT || 4001;

app.use("/auth", authRouter);
app.use("/posts", postRouter);
app.use("/user", userRouter);

app.get("/", (req, res) => {
    res.status(200).send("ok");
});

dbConnect();
app.listen(PORT, () => {
    console.log("listening on port:", PORT);
});
