const redis = require('redis');
const { promisify } = require('util');

class RedisClient {
  constructor() {
    this.client = redis.createClient();
    this.client.on('error', (err) => {
      console.log(`Error ${err}`);
    });
  }

  isAlive() {
    const connRedis = this.client.connected;
    if (connRedis) {
      return true;
    }
    return false;
  }

  async get(key) {
    const getValue = promisify(this.client.get).bind(this.client);
    const result = await getValue(key);
    return result;
  }

  async set(key, value, expires) {
    const setTimeout = promisify(this.client.set).bind(this.client);
    await setTimeout(key, value, 'EX', expires);
  }

  async del(key) {
    const delKey = promisify(this.client.del).bind(this.client);
    await delKey(key);
  }
}

export default new RedisClient();
