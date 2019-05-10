const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InTheatersSchema = new Schema({
    id:{
        type:Number
    },
    subjects:{
        type:Array
    },
    date: {
        type: Date,
        default: Date.now
    },
})

module.exports = InTheaters = mongoose.model("intheaters", InTheatersSchema);