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

module.exports.search = function (req, res) {
    // get data
    var input = '^.*' + req.body.search + '.*';

    Book.find({
        $or: [
            { title: { $regex: new RegExp(input, "i") } },
            { author: { $regex: new RegExp(input, "i") } }
        ]
    }, function (err, data) {
        console.log(data);
        if (data.length > 0) {
            res.render('books/index', {
                books: data
            });

            return;
        }

        res.render('books/index', {
            books: null
        });
    });


};
