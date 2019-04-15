const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const user = new Schema({
    firstname: String,
    lastname: String,
    username: String,
    password: String,
});

module.exports = mongoose.model('user', user);