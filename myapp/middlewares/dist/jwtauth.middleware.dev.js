"use strict";

var jwtHelper = require('../helpers/jwt.helper');

var accessTokenKey = process.env.ACCESS_TOKEN_SECRET || "default-secretkey";

var isAuth = function isAuth(req, res, next) {
  var tokenFromClient, decoded;
  return regeneratorRuntime.async(function isAuth$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          // lấy token gửi lên từ client. token được truyền qua header
          tokenFromClient = req.headers["access-token"]; // nếu tồn tại access-token

          if (!tokenFromClient) {
            _context.next = 15;
            break;
          }

          _context.prev = 2;
          _context.next = 5;
          return regeneratorRuntime.awrap(jwtHelper.verifyToken(tokenFromClient, accessTokenKey));

        case 5:
          decoded = _context.sent;
          // Lưu thông tin giải mã vào req
          req.jwtDecođe = decoded; // cho phep req đi tiếp sang controller

          next();
          _context.next = 13;
          break;

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](2);
          return _context.abrupt("return", res.status(401).json({
            message: 'Unauthorized'
          }));

        case 13:
          _context.next = 16;
          break;

        case 15:
          return _context.abrupt("return", res.status(403).send({
            message: 'No token provided.'
          }));

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[2, 10]]);
};

module.exports = {
  requireAuth: isAuth
};