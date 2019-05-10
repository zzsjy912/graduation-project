const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MovieinfoSchema = new Schema({
    rating: {
        user: {
            type: String,
            default: 0
        },
        average: {
            type: Number,
            default: 0
        }
    },
    // 游览人数
    reviews_count: { 
        type: Number,
        default: 0
    },
    // 想看人数
    wish_count: {
        type: Number,
        default: 0
    },
    year: {
        type: String,
    },
    images: {
        type: Object,
    },
    id: {
        type: String,
    },
    title: {
        type: String,
    },
    aka: {
        type: String,
    },
    original_title:{
        type: String
    },
    countries: [
        String
    ],
    genres: [
        String
    ],
    casts: [
        {
            alt: String,
            avatars: {
                small: String,
                large: String,
                medim: String
            },
            name: String,
            id: String
        }
    ],
    summary: {
        type: String
    },
    directors: [
        {
            alt: String,
            avatars: {
                small: String,
                large: String,
                medim: String
            },
            name: String,
            id: String
        }
    ],
    // 评论人数
    comments_count: {
        type: Number,
        default: 0
    },
    // 评分人数
    rating_count: {
        type: Number,
        default: 0
    }
})

module.exports = Movieinfo = mongoose.model("Movieinfo", MovieinfoSchema)