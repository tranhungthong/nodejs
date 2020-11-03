"use strict";

var weatherApi = require('../weatherApiCommon');

module.exports.index = function (req, res) {
  res.render('weathers/index', {
    title: 'weather',
    errors: null,
    search: null,
    data10Day: null,
    dataCurrent: null
  });
};

module.exports.search = function _callee(req, res) {
  var data10Day, dataCurrent;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(weatherApi.Get10Day('hanoi', 10, 'metric or imperial'));

        case 2:
          data10Day = _context.sent;
          _context.next = 5;
          return regeneratorRuntime.awrap(weatherApi.GetCurrent('hanoi', 'metric or imperial'));

        case 5:
          dataCurrent = _context.sent;
          console.log(data10Day && dataCurrent);

          if (data10Day) {
            res.render('weathers/index', {
              title: 'weather',
              data10Day: data10Day.data,
              dataCurrent: dataCurrent.data,
              search: req.body.search
            });
          } else {
            res.render('weathers/index', {
              title: 'weather',
              data10Day: null,
              dataCurrent: null,
              search: req.body.search
            });
          }

        case 8:
        case "end":
          return _context.stop();
      }
    }
  });
};