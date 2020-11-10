var User = require('../../models/user.model');
const jwtHelper = require('../../helpers/jwt.helper');
var globals = require('../../global');
const { use } = require('../../routes/auth.route');

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
        console.log(data);

        const user = {
            _id: data[0]._id,
            name: data[0].name,
            phone: data[0].phone,
            email: data[0].email
        }

        // thuc hien tao ma token
        const accessToken = await jwtHelper.generateToken(user, accessTokenSecret, accessTokenLife);
        console.log("accessToken", accessToken);
        user.accessToken = accessToken;

        // tao refresh token
        const refreshToken = await jwtHelper.generateToken(user, refreshTokenSecret, refreshTokenLife);
        user.refreshToken = refreshToken;
        console.log("refreshToken", refreshToken);

        return res.status(200).json(user);
    }

    return res.status(403).json({ message: "Invalid token" });
};
