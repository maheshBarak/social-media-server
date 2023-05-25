const mongoose = require("mongoose");

module.exports = async () => {
    const mongoUri =
        "mongodb+srv://mmahesh:oE0U3XMsVL8nm264@cluster0.z3apxld.mongodb.net/?retryWrites=true&w=majority";
    try {
        const connect = await mongoose.connect(mongoUri, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        console.log("Mongdb connected :", connect.connection.host);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};
