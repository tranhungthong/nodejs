const axios = require('axios');

module.exports.callback = async function (req, res) {
    var code = req.query.code;
    var authorization = `Basic ${Buffer.from(`${process.env.AWS_COGNITO_CLIENT_ID}:${process.env.AWS_COGNITO_CLIENT_SECURITY}`).toString('base64')}`;
    var url = process.env.AWS_COGNITO_DOMAIN_TOKEN;
    
    var data = await axios({
        method: "POST",
        url: url,
        headers: {
            'Authorization': authorization,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        params: {
            grant_type: 'authorization_code',
            code: code,
            client_id: process.env.AWS_COGNITO_CLIENT_ID,
            redirect_uri: process.env.AWS_COGNITO_CALLBACK_URL
        }
    });

    if (data.data.access_token) {
        res.cookie('access_token', data.data.access_token, {
            signed: true
        });

        res.redirect('/');
    }
}