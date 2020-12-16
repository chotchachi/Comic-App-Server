const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Category = new Schema({
    name: { type: String },
    link: { type: String },
    thumbnail: { type: String },
    description: { type: String }
}, {
    versionKey: false
});

module.exports = mongoose.model('Category', Category);
