const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    userId: {type: String, required: true},
    username: {type: String, required: true},
    password: {type: String, required: true},
    auth_time: {type: Date, required: true},
    register_time: {type:Date, required: true, default: Date.now()}
})

module.exports = mongoose.model("User", userSchema);