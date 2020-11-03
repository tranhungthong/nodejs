const weatherApi = require('../weatherApiCommon')

module.exports.index = function (req, res) {
    res.render('weathers/index', {
        title: 'weather',
        errors: null,
        search: null,
        data10Day: null,
        dataCurrent: null,
    });
};

module.exports.search = async function (req, res) {
    var city = req.body.search;
    const data10Day = await weatherApi.Get10Day(city, 10, 'metric or imperial');
    const dataCurrent = await weatherApi.GetCurrent(city, 'metric or imperial');

    if (data10Day && dataCurrent) {
        res.render('weathers/index', {
            title: 'weather',
            data10Day: data10Day.data,
            dataCurrent: dataCurrent.data,
            search: req.body.search
        });
    } else {
        res.render('weathers/index', {
            title: 'weather',
            data10Day: null,
            dataCurrent: null,
            search: req.body.search
        });
    }
};