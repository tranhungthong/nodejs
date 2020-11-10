"use strict";

var User = require('../../models/user.model');

var jwtHelper = require('../../helpers/jwt.helper');

var globals = require('../../global');

var _require = require('../../routes/auth.route'),
    use = _require.use; // thời gian sống của token


var accessTokenLife = process.env.ACCESS_TOKEN_LIFE || "1h";
var accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "123@123a";
var refreshTokenLife = process.env.REFRESH_TOKEN_LIFE || "3650d";
var refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || "123@123a"; // login from API

module.exports.apiLogin = function _callee(req, res) {
  var username, password, data, user, accessToken, refreshToken;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          username = req.body.username;
          password = req.body.password;
          _context.next = 4;
          return regeneratorRuntime.awrap(User.find({
            email: username,
            password: password
          }));

        case 4:
          data = _context.sent;

          if (!(data.length > 0)) {
            _context.next = 19;
            break;
          }

          console.log(data);
          user = {
            _id: data[0]._id,
            name: data[0].name,
            phone: data[0].phone,
            email: data[0].email
          }; // thuc hien tao ma token

          _context.next = 10;
          return regeneratorRuntime.awrap(jwtHelper.generateToken(user, accessTokenSecret, accessTokenLife));

        case 10:
          accessToken = _context.sent;
          console.log("accessToken", accessToken);
          user.accessToken = accessToken; // tao refresh token

          _context.next = 15;
          return regeneratorRuntime.awrap(jwtHelper.generateToken(user, refreshTokenSecret, refreshTokenLife));

        case 15:
          refreshToken = _context.sent;
          user.refreshToken = refreshToken;
          console.log("refreshToken", refreshToken);
          return _context.abrupt("return", res.status(200).json(user));

        case 19:
          return _context.abrupt("return", res.status(403).json({
            message: "Invalid token"
          }));

        case 20:
        case "end":
          return _context.stop();
      }
    }
  });
};