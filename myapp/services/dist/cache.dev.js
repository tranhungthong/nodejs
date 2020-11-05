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
  var hashKey = "".concat(options.userid, "_").concat(options.page);

  if (options.input != null) {
    this.key = "".concat(hashKey, "_").concat(options.input);
  } else {
    this.key = hashKey;
  }

  this.hashKey = JSON.stringify(hashKey || 'default');
  return this;
}; // create new cache function on prototype


mongoose.Query.prototype.exec = function _callee() {
  var _this = this;

  var cachedValue,
      parsedCache,
      result,
      _args = arguments;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (this.enableCache) {
            _context.next = 2;
            break;
          }

          return _context.abrupt("return", exec.apply(this, _args));

        case 2:
          // const key = JSON.stringify(Object.assign({}, this.getQuery(), {
          //     collection: this.mongooseCollection.name,
          // }));
          client.expire(this.hashKey, 600);
          _context.next = 5;
          return regeneratorRuntime.awrap(client.hget(this.hashKey, this.key));

        case 5:
          cachedValue = _context.sent;

          if (!cachedValue) {
            _context.next = 10;
            break;
          }

          parsedCache = JSON.parse(cachedValue);
          console.log('Data Source: Cache');
          return _context.abrupt("return", Array.isArray(parsedCache) ? parsedCache.map(function (doc) {
            return new _this.model(doc);
          }) : new this.model(parsedCache));

        case 10:
          _context.next = 12;
          return regeneratorRuntime.awrap(exec.apply(this, _args));

        case 12:
          result = _context.sent;
          client.hmset(this.hashKey, this.key, JSON.stringify(result));
          console.log('Data Source: Database');
          return _context.abrupt("return", result);

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, null, this);
};

module.exports = {
  clearCache: function clearCache(options) {
    var hashKey = "".concat(options.userid, "_").concat(options.page);
    console.log('Cache cleaned');
    client.del(JSON.stringify(hashKey));
  }
};