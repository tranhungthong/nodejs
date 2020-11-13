"use strict";

var User = require('../models/user.model'); // module.exports.requireAuth = async function (req, res, next) {
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


module.exports.requireAuth = function _callee(req, res, next) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (req.signedCookies.access_token) {
            _context.next = 3;
            break;
          }

          res.redirect("".concat(process.env.AWS_COGNITO_DOMAIN_LOGIN, "?response_type=code&client_id=").concat(process.env.AWS_COGNITO_CLIENT_ID, "&redirect_uri=").concat(process.env.AWS_COGNITO_CALLBACK_URL));
          return _context.abrupt("return");

        case 3:
          next();

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
};