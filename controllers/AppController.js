import dbClient from '../utils/db';
import redisClient from '../utils/redis';

export default class AppController {
  static getStatus(_req, res) {
    const aliveDB = dbClient.isAlive();
    const aliveRedis = redisClient.isAlive();
    res.status(200).json({ redis: aliveRedis, db: aliveDB });
  }

  static async getStats(_req, res) {
    const allUsers = await dbClient.nbUsers();
    const allFiles = await dbClient.nbFiles();
    res.status(200).json({ users: allUsers, files: allFiles });
  }
}
