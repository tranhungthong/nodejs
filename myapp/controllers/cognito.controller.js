const service = require('../services/cognito.service')

module.exports.callback = async function (req, res) {
    var code = req.query.code;
    var data = await service.callback(code);

    if (data.data.access_token) {
        res.cookie('access_token', data.data.access_token, {
            signed: true
        });

        res.cookie('refresh_token', data.data.refresh_token, {
            signed: true
        });

        res.redirect('/');
    }
}