module.exports.index = function (req, res) {
    res.render('weathers/index', {
        title: 'weather',
        errors: null
    });
};