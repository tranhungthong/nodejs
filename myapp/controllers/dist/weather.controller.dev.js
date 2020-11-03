"use strict";

var weatherApi = require('../weatherApiCommon');

module.exports.index = function (req, res) {
  res.render('weathers/index', {
    title: 'weather',
    errors: null,
    search: null,
    weathers: null
  });
};

module.exports.search = function _callee(req, res) {
  var response;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(weatherApi.GET('hanoi', 10, 'metric or imperial'));

        case 2:
          response = _context.sent;
          console.log(response.data.list);

          if (response.data) {
            res.render('weathers/index', {
              title: 'weather',
              weathers: response.data,
              search: req.body.search
            });
          } else {
            res.render('weathers/index', {
              title: 'weather',
              weathers: null,
              search: req.body.search
            });
          }

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
};