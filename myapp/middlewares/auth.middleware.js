var User = require('../models/user.model');

module.exports.requireAuth = function (req, res, next) {

    if (!req.signedCookies.userid) {
        res.redirect('/auth/login');
    }

    User.findById(req.signedCookies.userid, function (err, foundData) {
        if (foundData != null) {
            next();
        }
    });
}