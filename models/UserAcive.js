const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserAciveSchema = new Schema({
    useracive_id: {
        type: Number,
        default: -1
    },
    user_name: {
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
    date: {
        type: Date,
        default: Date.now
    },
})

module.exports = UserAcive = mongoose.model("useracive", UserAciveSchema);