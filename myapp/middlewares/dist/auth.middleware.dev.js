"use strict";

var User = require('../models/user.model');

var jwt = require('jsonwebtoken');

var jwkToPem = require('jwk-to-pem');

var cognitoService = require('../services/cognito.service');

var fs = require('fs'); // authe bang username password
// module.exports.requireAuth = async function (req, res, next) {
//     if (!req.signedCookies.userid) {
//         // res.redirect('/auth/login');
//         res.redirect(process.env.AWS_COGNITO_URI);
//     }
//     var data = await User.findById(req.signedCookies.userid).cache({
//         userid: req.signedCookies.userid,
//         page: 'login'
//     });
//     if (data != null) {
//         next();
//     }
// }
// auth bang aws cognito


module.exports.requireAuth = function _callee2(req, res, next) {
  var urlLogin, rawdata, jwk, pem;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          urlLogin = "".concat(process.env.AWS_COGNITO_DOMAIN_LOGIN, "?response_type=code&client_id=").concat(process.env.AWS_COGNITO_CLIENT_ID, "&redirect_uri=").concat(process.env.AWS_COGNITO_CALLBACK_URL); // nếu chưa login thì redirect tới màn hình login của aws cognito

          if (req.signedCookies.access_token) {
            _context2.next = 4;
            break;
          }

          res.redirect(urlLogin);
          return _context2.abrupt("return");

        case 4:
          // lay jwk o link sau: 
          // https://cognito-idp.us-east-1.amazonaws.com/us-east-1_kyqmWTssM/.well-known/jwks.json
          // https://cognito-idp.{Region}.amazonaws.com/{Poolid}/.well-known/jwks.json
          rawdata = fs.readFileSync('jwks.json');
          jwk = JSON.parse(rawdata);
          pem = jwkToPem(jwk.keys[1]); // kiem tra acces_token co đúng không

          jwt.verify(req.signedCookies.access_token, pem, {
            algorithms: ['RS256']
          }, function _callee(err, decodedToken) {
            var data;
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    if (!err) {
                      _context.next = 8;
                      break;
                    }

                    if (!req.signedCookies.refresh_token) {
                      _context.next = 6;
                      break;
                    }

                    _context.next = 4;
                    return regeneratorRuntime.awrap(cognitoService.refreshToken(req.signedCookies.refresh_token));

                  case 4:
                    data = _context.sent;

                    // Nếu lấy được access_token. Lưu vào cookie để sử dụng
                    if (data.data) {
                      res.cookie('access_token', data.data.access_token, {
                        signed: true
                      }); // cho phép chuyển tới controller

                      next();
                    } else {
                      // Nếu refresh_token không sử dụng được
                      // di chuyển tới màn hình login
                      res.redirect(urlLogin);
                    }

                  case 6:
                    _context.next = 9;
                    break;

                  case 8:
                    if (decodedToken) {
                      // Nếu access_token hợp lệ. cho phép di chuyển tới action tiếp theo
                      next();
                    }

                  case 9:
                  case "end":
                    return _context.stop();
                }
              }
            });
          });

        case 8:
        case "end":
          return _context2.stop();
      }
    }
  });
};