const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email: {
        type:String,
        required: true   
    }
})

userSchema.plugin(passportLocalMongoose);  //This plugin stores username hash and salt password 

module.exports = mongoose.model("User", userSchema);