const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NoticeSchema = new Schema({
    id: {
        type: Number,
        default: -1
    },
    user_name: {
        type: String,
        required: true
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

module.exports = Notice = mongoose.model("Notice", NoticeSchema)