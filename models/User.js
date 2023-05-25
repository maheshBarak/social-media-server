const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
    },
    password:{
        type:String,
        requires:true
    }
})

module.exports = mongoose.model("user",userSchema) // user ---> iss schema ka naam in mongodb files