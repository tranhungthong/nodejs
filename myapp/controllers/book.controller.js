var Book = require('../models/book.model');
var dateFormat = require('dateformat');
var globals = require('../global')


module.exports.index = async function (req, res) {
    // get data
    await Book.find({ is_del: false }, function (err, data) {
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

module.exports.update = async function (req, res) {
    // validate    
    if (req.body.title == null || req.body.title == '') {
        globals.error.description = 'Title is required.';
        res.json(globals.error);
        return;
    }

    var now = new Date();

    var book = await Book.findOne({ _id: req.body.id }, function (err, data) {
        var aaa = 1;
    });
    book.title = req.body.title;
    book.author = req.body.author;
    book.summary = req.body.summary;
    book.genre = req.body.genre;
    book.update_date = dateFormat(now, "yyyy/MM/dd");
    book.update_by = req.signedCookies.userid;

    await book.save(function (err) {
        if (err) {
            globals.error.description = err;
            res.json(globals.error);
            return;
        }
    })

    res.json(globals.success);
};

module.exports.delete = async function (req, res) {
    // validate    
    var now = new Date();

    var book = await Book.findOne({ _id: req.body.id }, function (err, data) {
        var aaa = 1;
    });

    book.is_del = true;
    book.update_date = dateFormat(now, "yyyy/MM/dd");
    book.update_by = req.signedCookies.userid;

    await book.save(function (err) {
        if (err) {
            globals.error.description = err;
            res.json(globals.error);
            return;
        }
    })

    res.json(globals.success);
};

module.exports.getABook = async function (req, res) {
    await Book.find({ _id: req.query.id }, function (err, data) {
        if (data != null && data.length > 0) {
            globals.success.data = data;
            res.json(globals.success);
            return;
        }
    });

    globals.success.data = null;
    res.json(globals.success);
};

module.exports.search = function (req, res) {
    // get data
    var input = '^.*' + req.body.search + '.*';

    Book.find({
        $and: [
            {
                $or: [
                    { title: { $regex: new RegExp(input, "i") } },
                    { author: { $regex: new RegExp(input, "i") } }
                ]
            }, {
                is_del: false
            }
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
