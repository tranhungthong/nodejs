var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    title: String,
    author: String,
    summary: String,
    ISBN: String,
    genre: String,
    img_cover: String,
    create_date: String,
    create_by: String,
    update_date: String,
    update_by: String,
});

var Book = mongoose.model('Book', userSchema, 'Book');

module.exports = Book;