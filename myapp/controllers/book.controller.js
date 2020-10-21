var Book = require('../models/book.model');

module.exports.index = function (req, res) {
    // get data
    Book.find({}, function (err, data) {
        if (data.length > 0) {
            console.log(data);

            res.render('books/index', {
                books: data
            });

            return;
        }

        res.render('books/index');
    });


};
