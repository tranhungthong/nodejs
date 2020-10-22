"use strict";

var Book = require('../models/book.model');

var dateFormat = require('dateformat');

var globals = require('../global');

module.exports.index = function _callee(req, res) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(Book.find({}, function (err, data) {
            if (data.length > 0) {
              res.render('books/index', {
                books: data
              });
              return;
            }
          }));

        case 2:
          res.render('books/index', {
            books: null
          });

        case 3:
        case "end":
          return _context.stop();
      }
    }
  });
};

module.exports.add = function _callee2(req, res) {
  var now, book;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          now = new Date();
          book = new Book({
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
          _context2.next = 4;
          return regeneratorRuntime.awrap(book.save(function (err) {
            if (err) {
              globals.result.status = "error";
              globals.result.description = err;
              res.send(globals.result);
              return;
            }
          }));

        case 4:
          res.json(globals.result);

        case 5:
        case "end":
          return _context2.stop();
      }
    }
  });
};

module.exports.search = function (req, res) {
  // get data
  var input = '^.*' + req.body.search + '.*';
  Book.find({
    $or: [{
      title: {
        $regex: new RegExp(input, "i")
      }
    }, {
      author: {
        $regex: new RegExp(input, "i")
      }
    }]
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