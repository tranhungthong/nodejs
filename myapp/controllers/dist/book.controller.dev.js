"use strict";

var Book = require('../models/book.model');

var dateFormat = require('dateformat');

var globals = require('../global');

var _require = require('../services/cache'),
    clearCache = _require.clearCache;

module.exports.index = function _callee(req, res) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(Book.find({
            is_del: false
          }, function (err, data) {
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

          valid = ValidateBook(book);

          if (!(valid != '')) {
            _context2.next = 8;
            break;
          }

          globals.error.description = valid;
          res.json(globals.error);
          return _context2.abrupt("return");

        case 8:
          _context2.next = 10;
          return regeneratorRuntime.awrap(book.save(function (err) {
            if (err) {
              globals.error.description = err;
              res.json(globals.error);
              return;
            }
          }));

        case 10:
          res.json(globals.success);

        case 11:
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

module.exports.update = function _callee3(req, res) {
  var now, book;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          if (!(req.body.book_title == null || req.body.book_title == '')) {
            _context3.next = 4;
            break;
          }

          globals.error.description = 'Title is required.';
          res.json(globals.error);
          return _context3.abrupt("return");

        case 4:
          now = new Date();
          _context3.next = 7;
          return regeneratorRuntime.awrap(Book.findOne({
            _id: req.body.book_id
          }, function (err, data) {
            var aaa = 1;
          }));

        case 7:
          book = _context3.sent;
          book.title = req.body.book_title;
          book.author = req.body.book_author;
          book.summary = req.body.book_summary;
          book.genre = req.body.book_genre;
          book.update_date = dateFormat(now, "yyyy/MM/dd");
          book.update_by = req.signedCookies.userid;

          if (req.file != null) {
            book.img_cover = req.file.path.split('\\').slice(1).join('\\');
          }

          _context3.next = 17;
          return regeneratorRuntime.awrap(book.save(function (err) {
            if (err) {
              globals.error.description = err;
              res.json(globals.error);
              return;
            }
          }));

        case 17:
          res.json(globals.success);

        case 18:
        case "end":
          return _context3.stop();
      }
    }
  });
};

module.exports["delete"] = function _callee4(req, res) {
  var now, book;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          // validate    
          now = new Date();
          _context4.next = 3;
          return regeneratorRuntime.awrap(Book.findOne({
            _id: req.body.id
          }, function (err, data) {
            var aaa = 1;
          }));

        case 3:
          book = _context4.sent;
          book.is_del = true;
          book.update_date = dateFormat(now, "yyyy/MM/dd");
          book.update_by = req.signedCookies.userid;
          _context4.next = 9;
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
          return _context4.stop();
      }
    }
  });
};

module.exports.getABook = function _callee5(req, res) {
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
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
          return _context5.stop();
      }
    }
  });
};

module.exports.search = function _callee6(req, res) {
  var input, data;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          // get data
          input = '^.*' + req.body.search + '.*$';
          _context6.next = 3;
          return regeneratorRuntime.awrap(Book.find({
            $and: [{
              $or: [{
                title: {
                  $regex: new RegExp(input, "i")
                }
              }, {
                author: {
                  $regex: new RegExp(input, "i")
                }
              }]
            }, {
              is_del: false
            }]
          }).cache({
            userid: req.signedCookies.userid,
            page: 'book',
            input: req.body.search
          }));

        case 3:
          data = _context6.sent;

          if (!(data.length > 0)) {
            _context6.next = 7;
            break;
          }

          res.render('books/index', {
            books: data,
            search: req.body.search
          });
          return _context6.abrupt("return");

        case 7:
          res.render('books/index', {
            books: null,
            search: req.body.search
          });

        case 8:
        case "end":
          return _context6.stop();
      }
    }
  });
};