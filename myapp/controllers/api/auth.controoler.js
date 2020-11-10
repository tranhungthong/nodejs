var User = require('../../models/user.model');
const jwtHelper = require('../../helpers/jwt.helper');
var globals = require('../../global');

// thời gian sống của token
const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || "1h";
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "123@123a";
const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE || "3650d";
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || "123@123a";

// login from API
module.exports.apiLogin = async function (req, res) {
    var username = req.body.username;
    var password = req.body.password;

    var data = await User.find({ email: username, password: password });

    if (data.length > 0) {
        const user = {
            _id: data[0]._id,
            name: data[0].name,
            phone: data[0].phone,
            email: data[0].email
        }

        // thuc hien tao ma token
        const accessToken = await jwtHelper.generateToken(user, accessTokenSecret, accessTokenLife);
        user.accessToken = accessToken;

        // // tao refresh token
        // const refreshToken = await jwtHelper.generateToken(user, refreshTokenSecret, refreshTokenLife);
        // user.refreshToken = refreshToken;
        // console.log("refreshToken", refreshToken);

        globals.success.data = user
        return res.json(globals.success);
    }

    globals.error.message = "Invalid token";
    return res.json(globals.error);
};
