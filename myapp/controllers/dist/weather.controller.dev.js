"use strict";

var weatherApi = require('../weatherApiCommon');

module.exports.index = function (req, res) {
  console.log('begin call api');

  var asyncApiCall = function asyncApiCall() {
    var res;
    return regeneratorRuntime.async(function asyncApiCall$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap(weatherApi.GET('hanoi', 10, 'metric or imperial'));

          case 2:
            res = _context.sent;
            console.log(res.data);

          case 4:
          case "end":
            return _context.stop();
        }
      }
    });
  };

  asyncApiCall();
  res.render('weathers/index', {
    title: 'weather',
    errors: null
  });
};