"use strict";

var _require = require('../services/cache'),
    clearCache = _require.clearCache;

module.exports = {
  clearCacheByKey: function clearCacheByKey(req, res, next) {
    var afterResponse;
    return regeneratorRuntime.async(function clearCacheByKey$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            afterResponse = function afterResponse() {
              res.removeListener('finish', afterResponse);
              if (res.statusCode < 400) clearCache("".concat(req.signedCookies.userid, "_").concat(req.baseUrl.replace('/', '')));
            };

            res.on('finish', afterResponse);
            next();

          case 3:
          case "end":
            return _context.stop();
        }
      }
    });
  }
};