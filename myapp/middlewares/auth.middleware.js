var User = require('../models/user.model');
var jwt = require('jsonwebtoken');
var jwkToPem = require('jwk-to-pem');
const cognitoService = require('../services/cognito.service');
const fs = require('fs');

// authe bang username password
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
module.exports.requireAuth = async function (req, res, next) {
    var urlLogin = `${process.env.AWS_COGNITO_DOMAIN_LOGIN}?response_type=code&client_id=${process.env.AWS_COGNITO_CLIENT_ID}&redirect_uri=${process.env.AWS_COGNITO_CALLBACK_URL}`;

    // nếu chưa login thì redirect tới màn hình login của aws cognito
    if (!req.signedCookies.access_token) {
        res.redirect(urlLogin);
        return;
    }

    // lay jwk o link sau: 
    // https://cognito-idp.us-east-1.amazonaws.com/us-east-1_kyqmWTssM/.well-known/jwks.json
    // https://cognito-idp.{Region}.amazonaws.com/{Poolid}/.well-known/jwks.json
    let rawdata = fs.readFileSync('jwks.json');
    let jwk = JSON.parse(rawdata);
    var pem = jwkToPem(jwk.keys[1]);

    // kiem tra acces_token co đúng không
    jwt.verify(req.signedCookies.access_token, pem, { algorithms: ['RS256'] }, async function (err, decodedToken) {
        // trường hợp token không đúng hoặc hết hạn
        // làm mới access_token từ refresh_ken
        if (err) {
            if (req.signedCookies.refresh_token) {
                var data = await cognitoService.refreshToken(req.signedCookies.refresh_token);

                // Nếu lấy được access_token. Lưu vào cookie để sử dụng
                if (data.data) {
                    res.cookie('access_token', data.data.access_token, {
                        signed: true
                    });

                    // cho phép chuyển tới controller
                    next();
                } else {
                    // Nếu refresh_token không sử dụng được
                    // di chuyển tới màn hình login
                    res.redirect(urlLogin);
                }
            }
        }
        else if (decodedToken) {
            // Nếu access_token hợp lệ. cho phép di chuyển tới action tiếp theo
            next();
        }
    });
}