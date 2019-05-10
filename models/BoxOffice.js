const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BoxOfficeSchema = new Schema({
    data: [
        
    ],

})

module.exports = BoxOffice = mongoose.model("boxoffice", BoxOfficeSchema);



