"use strict";

var User = require('../models/user.model');

module.exports.requireAuth = function _callee(req, res, next) {
  var data;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!req.signedCookies.userid) {
            res.redirect('/auth/login');
          }

          _context.next = 3;
          return regeneratorRuntime.awrap(User.findById(req.signedCookies.userid).cache({
            userid: req.signedCookies.userid,
            page: 'login'
          }));

        case 3:
          data = _context.sent;

          if (data != null) {
            next();
          }

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
};