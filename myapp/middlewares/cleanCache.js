const { clearCache } = require('../services/cache');

module.exports = {
  async clearCacheByKey(req, res, next) {
    const afterResponse = () => {
      res.removeListener('finish', afterResponse);

      if (res.statusCode < 400) clearCache({
        userid: req.signedCookies.userid,
        page: req.baseUrl.replace('/', '')
      });
    };

    res.on('finish', afterResponse);
    next();
  },
};