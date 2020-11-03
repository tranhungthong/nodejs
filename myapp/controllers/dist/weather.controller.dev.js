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
  var city, data10Day, dataCurrent;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          city = req.body.search;
          _context.next = 3;
          return regeneratorRuntime.awrap(weatherApi.Get10Day(city, 10, 'metric or imperial'));

        case 3:
          data10Day = _context.sent;
          _context.next = 6;
          return regeneratorRuntime.awrap(weatherApi.GetCurrent(city, 'metric or imperial'));

        case 6:
          dataCurrent = _context.sent;

          if (data10Day && dataCurrent) {
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