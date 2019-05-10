const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ParagraphReplySchema = new Schema({
    paragraphReply_id:{
        type: Number,
    },
    paragraph_id: {
        type: Number,
        default: -1
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
    date: {
        type: Date,
        default: Date.now
    },
})

module.exports = ParagraphReply = mongoose.model("paragraphReply", ParagraphReplySchema);