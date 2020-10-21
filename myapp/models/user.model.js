var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    name: String,
    phone: String,
    email: String,
    password: String
});

var User = mongoose.model('User', userSchema, 'User');

module.exports = User;