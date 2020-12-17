const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Chapter = new Schema({
    view: { type: String },
    chapter_name: { type: String },
    time: { type: String },
    chapter_link: { type: String }
}, {
    versionKey: false
});

module.exports = mongoose.model('Chapter', Chapter);
