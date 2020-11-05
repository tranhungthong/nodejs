const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');

const client = redis.createClient(process.env.REDIS_URL);
client.hget = util.promisify(client.hget);

// Overriding the Default Mongoose Exec Function
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function (options = {}) {
    this.enableCache = true;
    var hashKey = `${options.userid}_${options.page}`

    if (options.input != null) {
        this.key = `${hashKey}_${options.input}`
    } else {
        this.key = hashKey;
    }

    this.hashKey = JSON.stringify(hashKey || 'default');

    return this;
};

// create new cache function on prototype
mongoose.Query.prototype.exec = async function () {
    if (!this.enableCache) {
        return exec.apply(this, arguments);
    }

    // const key = JSON.stringify(Object.assign({}, this.getQuery(), {
    //     collection: this.mongooseCollection.name,
    // }));
    client.expire(this.hashKey, 600);

    const cachedValue = await client.hget(this.hashKey, this.key);

    if (cachedValue) {
        const parsedCache = JSON.parse(cachedValue);

        console.log('Data Source: Cache');

        return Array.isArray(parsedCache)
            ? parsedCache.map(doc => new this.model(doc))
            : new this.model(parsedCache);
    }

    const result = await exec.apply(this, arguments);

    client.hmset(this.hashKey, this.key, JSON.stringify(result));

    console.log('Data Source: Database');
    return result;
};



module.exports = {
    clearCache(options) {
        var hashKey = `${options.userid}_${options.page}`
        console.log('Cache cleaned');
        client.del(JSON.stringify(hashKey));
    }
}