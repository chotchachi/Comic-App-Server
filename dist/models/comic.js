const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Author = require('./author')
const Cate = require('./categoryOfComic')
const Chapter = require('./chapter')

const Comic = new Schema({
    title: { type: String },
    thumbnail: { type: String },
    view: { type: String },
    shortened_content: { type: String },
    link: { type: String },
    categories: { type: [Cate.schema], default: [] },
    authors: { type: [Author.schema], default: [] },
    chapters: { type: [Chapter.schema], default: [] }
}, {
    versionKey: false
});

module.exports = mongoose.model('Comic', Comic);
