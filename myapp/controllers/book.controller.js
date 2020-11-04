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
        title: req.body.book_title,
        author: req.body.book_author,
        summary: req.body.book_summary,
        genre: req.body.book_genre,
        ISBN: '',
        img_cover: '',
        create_date: dateFormat(now, "yyyy/MM/dd"),
        create_by: req.signedCookies.userid,
        update_date: dateFormat(now, "yyyy/MM/dd"),
        update_by: req.signedCookies.userid,
        is_del: false
    });

    if (req.file != null) {
        book.img_cover = req.file.path.split('\\').slice(1).join('\\');
    }

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
    if (req.body.book_title == null || req.body.book_title == '') {
        globals.error.description = 'Title is required.';
        res.json(globals.error);
        return;
    }

    var now = new Date();

    var book = await Book.findOne({ _id: req.body.book_id }, function (err, data) {
        var aaa = 1;
    });

    book.title = req.body.book_title;
    book.author = req.body.book_author;
    book.summary = req.body.book_summary;
    book.genre = req.body.book_genre;
    book.update_date = dateFormat(now, "yyyy/MM/dd");
    book.update_by = req.signedCookies.userid;

    if (req.file != null) {
        book.img_cover = req.file.path.split('\\').slice(1).join('\\');
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
    //production redis url
    let redis_url = process.env.REDIS_URL;

    // redis setup
    // let client = require('redis').createClient(redis_url);
    let Redis = require('ioredis');
    let redis = new Redis(redis_url);

    // get data
    var input = '^.*' + req.body.search + '.*';
    var cacheId = `${req.signedCookies.userid}_search_${input}`;

    // GET representative deatils
    redis.expire(cacheId, 60);
    redis.get(cacheId, (error, rep) => {
        var data = null;
        if (error) {
            res.status(500).json({ error: error });
            return;
        }

        // read data from cache and parse to JSON
        if (rep) {
            data = JSON.parse(rep);
            console.log('get data from cache');
            res.render('books/index', {
                books: data,
                search: req.body.search
            });
        } else {
            console.log('get data from database');
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
                    redis.set(cacheId, JSON.stringify(data), (error, result) => {
                        if (error) {
                            console.log(error)
                            res.status(500).json({ error: error });
                        }
                    })
                    return;
                }

                res.render('books/index', {
                    books: null,
                    search: req.body.search
                });
            });
        }
    })
};
