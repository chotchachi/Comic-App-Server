const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Author = new Schema({
    name: { type: String },
    link: { type: String }
}, {
    versionKey: false
});

module.exports = mongoose.model('Author', Author);
