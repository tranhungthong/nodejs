const jwtHelper = require('../helpers/jwt.helper');
const accessTokenKey = process.env.ACCESS_TOKEN_SECRET || "default-secretkey";

let isAuth = async (req, res, next) => {
    // lấy token gửi lên từ client. token được truyền qua header
    const tokenFromClient = req.headers["access-token"];

    // nếu tồn tại access-token
    if (tokenFromClient) {
        try {
            // thuc hien giai ma token
            const decoded = await jwtHelper.verifyToken(tokenFromClient, accessTokenKey);

            // Lưu thông tin giải mã vào req
            req.jwtDecođe = decoded;

            // cho phep req đi tiếp sang controller
            next();
        } catch (err) {
            // Nêu có lỗi: không đúng, hết hạn...
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }
    } else {
        // Không tìm thấy token trong request
        return res.status(403).send({
            message: 'No token provided.',
        });
    }
}

module.exports = {
    requireAuth: isAuth
}