const express = require("express");

const dbConnect = require("./dbConnect");
const dotenv = require("dotenv");
dotenv.config("./.env");
const authRouter = require("./routers/authRouter");
const postRouter = require("./routers/postRouter");
const morgan = require("morgan");

const app = express();

// middlewares          install morgan
app.use(express.json());

const PORT = process.env.PORT || 4001;

app.use("/auth", authRouter);
app.use("/posts", postRouter);
app.use(morgan("common"));

app.get("/", (req, res) => {
    res.status(200).send("ok");
});

dbConnect();
app.listen(PORT, () => {
    console.log("listening on port:", PORT);
});
