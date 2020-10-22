var Book = require('../models/book.model');
var dateFormat = require('dateformat');
var globals = require('../global')


module.exports.index = async function (req, res) {
    // get data
    await Book.find({}, function (err, data) {
        if (data.length > 0) {
            res.render('books/index', {
                books: data
            });

            return;
        }
    });

    res.render('books/index', { books: null });
};

module.exports.add = async function (req, res) {
    var now = new Date();

    var book = new Book({
        title: req.body.title,
        author: req.body.author,
        summary: req.body.summary,
        message: req.body.message,
        genre: req.body.genre,
        ISBN: '',
        img_cover: '',
        create_date: dateFormat(now, "yyyy/MM/dd"),
        create_by: req.signedCookies.userid,
        update_date: dateFormat(now, "yyyy/MM/dd"),
        update_by: req.signedCookies.userid,
        is_del: false
    });

    await book.save(function (err) {
        if (err) {
            globals.result.status = "error";
            globals.result.description = err;
            res.send(globals.result);
            return;
        }
    })

    res.json(globals.result);
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
