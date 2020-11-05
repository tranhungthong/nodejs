var User = require('../models/user.model');

module.exports.requireAuth = async function (req, res, next) {

    if (!req.signedCookies.userid) {
        res.redirect('/auth/login');
    }

    var data = await User.findById(req.signedCookies.userid).cache({
        userid: req.signedCookies.userid,
        page: 'login'
    });

    if (data != null) {
        next();
    }
}