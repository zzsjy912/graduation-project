const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    message_id: {
        type: Number,
    },
    user_name: {
        type: String,
        required: true
    },
    user_avatar: {
        type: String,
    },
    reply_name:{
        type: String,
        default:'0'
    },
    reply_avatar: {
        type: String,
        default: '0'
    },
    content: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    type_id: {
        type: Number,
        default: -1
    },
    is_read: {
        type: Number,
        default: 0
    },
    status: {
        type: Number,
        default: 0
    },
    date: {
        type: Date,
        default: Date.now
    },
})

module.exports = Message = mongoose.model("message", MessageSchema);