var Book = require('../models/book.model');
var dateFormat = require('dateformat');
var globals = require('../global')


module.exports.index = async function (req, res) {
    // get data
    await Book.find({}, function (err, data) {
        if (data.length > 0) {
            res.render('books/index', {
                books: data,
                search: null
            });

            return;
        }
    });

    res.render('books/index', { books: null, search: null });
};

module.exports.add = async function (req, res) {
    // validate    

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

    var valid = ValidateBook(book);

    if (valid != '') {
        globals.error.description = valid;
        res.json(globals.error);
        return;
    }

    await book.save(function (err) {
        if (err) {
            globals.error.description = err;
            res.json(globals.error);
            return;
        }
    })

    res.json(globals.success);
};

function ValidateBook(book) {
    var msg = '';
    if (!book.title) {
        msg += 'Title is required.'
    }

    return msg;
}

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
                books: data,
                search: req.body.search
            });

            return;
        }

        res.render('books/index', {
            books: null,
            search: null
        });
    });


};
