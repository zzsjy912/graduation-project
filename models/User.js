const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
    },
    isban:{ 
        type: Number,
        default:0
    },
    identity:{
        type: String,
        required:false
    },
    data: {
        type: Date,
        default: Date.now
    },
})

module.exports = User = mongoose.model("users",UserSchema);