"use strict";

var axios = require('axios');

module.exports.callback = function _callee(req, res) {
  var code, authorization, url, data;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          code = req.query.code;
          authorization = "Basic ".concat(Buffer.from("".concat(process.env.AWS_COGNITO_CLIENT_ID, ":").concat(process.env.AWS_COGNITO_CLIENT_SECURITY)).toString('base64'));
          url = process.env.AWS_COGNITO_DOMAIN_TOKEN;
          _context.next = 5;
          return regeneratorRuntime.awrap(axios({
            method: "POST",
            url: url,
            headers: {
              'Authorization': authorization,
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            params: {
              grant_type: 'authorization_code',
              code: code,
              client_id: process.env.AWS_COGNITO_CLIENT_ID,
              redirect_uri: process.env.AWS_COGNITO_CALLBACK_URL
            }
          }));

        case 5:
          data = _context.sent;

          if (data.data.access_token) {
            res.cookie('access_token', data.data.access_token, {
              signed: true
            });
            res.redirect('/');
          }

        case 7:
        case "end":
          return _context.stop();
      }
    }
  });
};