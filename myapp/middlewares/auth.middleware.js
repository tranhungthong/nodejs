var User = require('../models/user.model');

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

module.exports.requireAuth = async function (req, res, next) {
    if (!req.signedCookies.access_token) {
        res.redirect(`${process.env.AWS_COGNITO_DOMAIN_LOGIN}?response_type=code&client_id=${process.env.AWS_COGNITO_CLIENT_ID}&redirect_uri=${process.env.AWS_COGNITO_CALLBACK_URL}`);
        return;
    }

    next();
}