import sha1 from 'sha1';
import { v4 as uuid } from 'uuid';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class AuthController {
  static async getConnect(req, res) {
    const headers = req.header('Authorization').slice(6);
    const buff = Buffer.from(headers, 'base64');

    const [email, password] = buff.toString('utf-8').split(':');
    const usr = dbClient.userFind({ email });

    if (!usr) return res.status(401).json({ error: 'Unauthorized' });

    if (sha1(password) !== usr.password) {
      return res.status(403).json({ error: 'Not found credentials' });
    }

    const token = uuid();
    const tokenKey = `auth_${token}`;
    await redisClient.set(tokenKey, usr._id.toString(), 60 * 60 * 24);

    return res.status(200).json({ token });
  }

  static async getDisconnect(req, res) {
    const token = req.header('X-Token');
    const tokenKey = `auth_${token}`;

    const encryptUuid = await redisClient.get(tokenKey);
    if (!encryptUuid) return res.status(404).json({ error: 'Unauthorized' });
    await redisClient.del(tokenKey);

    return res.status(204).json({});
  }
}

export default AuthController;
