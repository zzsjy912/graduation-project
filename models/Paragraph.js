const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ParagraphSchema = new Schema({
    paragraph_id: {
        type: Number,
        default: -1
    },
    type: {
        type: String,
        default: 'movie'
    },
    id: {
        type: String,
        required: true
    },
    user_name: {
        type: String,
        required: true
    },
    user_avatar: {
        type: String,
    },
    content: {
        type: String,
        required: true
    },
    like_num: {
        type: Number,
        default: 0
    },
    date: {
        type: Date,
        default: Date.now
    },
})

module.exports = Paragraph = mongoose.model("paragraph", ParagraphSchema);