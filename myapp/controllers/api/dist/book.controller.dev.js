"use strict";

var Book = require('../../models/book.model');

var globals = require('../../global');

module.exports.search = function _callee(req, res) {
  var input, data;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          // get data
          input = '^.*' + req.body.search + '.*$';
          _context.next = 3;
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
          data = _context.sent;
          globals.success.data = data;
          res.json(globals.success);

        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
};