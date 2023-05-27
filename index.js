const express = require("express");

const dbConnect = require("./dbConnect");
const dotenv = require("dotenv");
dotenv.config("./.env");
const authRouter = require("./routers/authRouter");
const postRouter = require("./routers/postRouter");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

// middlewares
app.use(express.json());
app.use(morgan("common"));
app.use(cookieParser());
app.use(
    cors({
        credentials: true,
        origin: "http://localhost:3000",
    })
);

const PORT = process.env.PORT || 4001;

app.use("/auth", authRouter);
app.use("/posts", postRouter);

app.get("/", (req, res) => {
    res.status(200).send("ok");
});

dbConnect();
app.listen(PORT, () => {
    console.log("listening on port:", PORT);
});
