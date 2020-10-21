var User = require('../models/user.model');

module.exports.login = function (req, res) {
    res.render('users/login', {
        title: 'login form',
        layout: '../views/layouts/empty',
        errors: null
    });
};

module.exports.postLogin = function (req, res) {
    var username = req.body.username;
    var password = req.body.password;

    // var user = new User({
    //     name: 'test1',
    //     phone: 'phone1',
    //     email: 'email1@gmail.com',
    //     password: '123456'
    // })

    // user.save(function (err) {
    //     console.log(err);
    // })

    User.find({ email: username, password: password }, function (err, foundData) {
        if (foundData.length > 0) {
            res.redirect('/home');
        }

        res.render('users/login', {
            layout: '../views/layouts/empty',
            errors: [
                'Email or password not correct.'
            ]
        });
    });
};