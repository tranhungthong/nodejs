"use strict";

var service = require('../services/cognito.service');

module.exports.callback = function _callee(req, res) {
  var code, data;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          code = req.query.code;
          _context.next = 3;
          return regeneratorRuntime.awrap(service.callback(code));

        case 3:
          data = _context.sent;

          if (data.data.access_token) {
            res.cookie('access_token', data.data.access_token, {
              signed: true
            });
            res.cookie('refresh_token', data.data.refresh_token, {
              signed: true
            });
            res.redirect('/');
          }

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
};