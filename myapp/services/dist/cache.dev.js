"use strict";

var mongoose = require('mongoose');

var redis = require('redis');

var util = require('util');

var client = redis.createClient(process.env.REDIS_URL);
client.hget = util.promisify(client.hget); // Overriding the Default Mongoose Exec Function

var exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function () {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  this.enableCache = true;
  this.hashKey = JSON.stringify(options.key || 'default');
  return this;
}; // create new cache function on prototype


mongoose.Query.prototype.exec = function _callee() {
  var _this = this;

  var key,
      cachedValue,
      parsedCache,
      result,
      _args = arguments;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log("enableCache: ".concat(this.enableCache));

          if (this.enableCache) {
            _context.next = 3;
            break;
          }

          return _context.abrupt("return", exec.apply(this, _args));

        case 3:
          key = JSON.stringify(Object.assign({}, this.getFilter(), {
            collection: this.mongooseCollection.name
          }));
          client.expire(this.hashKey, 600);
          _context.next = 7;
          return regeneratorRuntime.awrap(client.hget(this.hashKey, key));

        case 7:
          cachedValue = _context.sent;

          if (!cachedValue) {
            _context.next = 12;
            break;
          }

          parsedCache = JSON.parse(cachedValue);
          console.log('Data Source: Cache');
          return _context.abrupt("return", Array.isArray(parsedCache) ? parsedCache.map(function (doc) {
            return new _this.model(doc);
          }) : new this.model(parsedCache));

        case 12:
          _context.next = 14;
          return regeneratorRuntime.awrap(exec.apply(this, _args));

        case 14:
          result = _context.sent;
          client.hmset(this.hashKey, key, JSON.stringify(result));
          console.log('Data Source: Database');
          return _context.abrupt("return", result);

        case 18:
        case "end":
          return _context.stop();
      }
    }
  }, null, this);
};

module.exports = {
  clearCache: function clearCache(hashKey) {
    console.log('Cache cleaned');
    client.del(JSON.stringify(hashKey));
  }
};