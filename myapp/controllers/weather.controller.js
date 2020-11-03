const weatherApi = require('../weatherApiCommon')

module.exports.index = function (req, res) {
    console.log('begin call api')
    const asyncApiCall = async () => {
        const res = await weatherApi.GET('hanoi', 10, 'metric or imperial');
        console.log(res.data)
    }

    asyncApiCall();

    res.render('weathers/index', {
        title: 'weather',
        errors: null
    });
};

