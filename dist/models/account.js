const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Account = new Schema({
    name: { type: String },
    username: { type: String },
    password: { type: String },
    level: { type: Number, default: 0 },
    token: { type: String, default: '' }
}, {
    versionKey: false
});

module.exports = mongoose.model('Account', Account);
