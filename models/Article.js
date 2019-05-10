const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    article_id: {
        type: Number,
        default: -1
    },
    movie_id: {
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
    title:{
        type: String
    },
    topic:{
        type: String
    },
    content: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        default: 0
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

module.exports = Article = mongoose.model("article", ArticleSchema);