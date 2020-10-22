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
                books: data,
                search: null
              });
              return;
            }
          }));

        case 2:
          res.render('books/index', {
            books: null,
            search: null
          });

        case 3:
        case "end":
          return _context.stop();
      }
    }
  });
};

module.exports.add = function _callee2(req, res) {
  var now, book, valid;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          // validate    
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
          valid = ValidateBook(book);

          if (!(valid != '')) {
            _context2.next = 7;
            break;
          }

          globals.error.description = valid;
          res.json(globals.error);
          return _context2.abrupt("return");

        case 7:
          _context2.next = 9;
          return regeneratorRuntime.awrap(book.save(function (err) {
            if (err) {
              globals.error.description = err;
              res.json(globals.error);
              return;
            }
          }));

        case 9:
          res.json(globals.success);

        case 10:
        case "end":
          return _context2.stop();
      }
    }
  });
};

function ValidateBook(book) {
  var msg = '';

  if (!book.title) {
    msg += 'Title is required.';
  }

  return msg;
}

module.exports.getABook = function _callee3(req, res) {
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(Book.find({
            _id: req.query.id
          }, function (err, data) {
            if (data != null && data.length > 0) {
              globals.success.data = data;
              res.json(globals.success);
              return;
            }
          }));

        case 2:
          globals.success.data = null;
          res.json(globals.success);

        case 4:
        case "end":
          return _context3.stop();
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