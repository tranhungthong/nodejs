const { cleanCache } = require('../services/cache');

module.exports = async (req, res, next) => {
    // wait for route handler to finish running
    await next();
    cleanCache(req.signedCookies.userid);
}