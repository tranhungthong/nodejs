const axios = require('axios');

module.exports.callback = (code) => {
    // convert to base64
    // authorization: Basic clientid:security_key
    var authorization = `Basic ${Buffer.from(`${process.env.AWS_COGNITO_CLIENT_ID}:${process.env.AWS_COGNITO_CLIENT_SECURITY}`).toString('base64')}`;
    var url = process.env.AWS_COGNITO_DOMAIN_TOKEN;

    // get access token, refresh token
    return axios({
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
}

module.exports.refreshToken = (refresh_token) => {
    // convert to base64
    // authorization: Basic clientid:security_key
    var authorization = `Basic ${Buffer.from(`${process.env.AWS_COGNITO_CLIENT_ID}:${process.env.AWS_COGNITO_CLIENT_SECURITY}`).toString('base64')}`;
    var url = process.env.AWS_COGNITO_DOMAIN_TOKEN;

    // get access token, refresh token
    return axios({
        method: "POST",
        url: url,
        headers: {
            'Authorization': authorization,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        params: {
            grant_type: 'refresh_token',
            client_id: process.env.AWS_COGNITO_CLIENT_ID,
            refresh_token: refresh_token
        }
    });
}