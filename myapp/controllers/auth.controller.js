module.exports.login = function (req, res) {
    res.render('users/login', {
        title: 'login form',
        layout:'../views/layouts/empty'
    });
};

module.exports.postLogin = function (req, res) {
    res.redirect('/home');
};