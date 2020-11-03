const weatherApi = require('../weatherApiCommon')

module.exports.index = function (req, res) {
    res.render('weathers/index', {
        title: 'weather',
        errors: null,
        search: null,
        weathers: null
    });
};

module.exports.search = async function (req, res) {
    const response = await weatherApi.GET('hanoi', 10, 'metric or imperial');
    console.log(response.data.list);

    if (response.data) {
        res.render('weathers/index', {
            title: 'weather',
            weathers: response.data,
            search: req.body.search
        });
    } else {
        res.render('weathers/index', {
            title: 'weather',
            weathers: null,
            search: req.body.search
        });
    }
};