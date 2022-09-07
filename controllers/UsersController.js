import sha1 from 'sha1';
import { ObjectId } from 'mongodb';
import dbClient from '../utils/db';
import RedisClient from '../utils/redis';

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }

    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    const userExists = await dbClient.client.db('files_manager').collection('users').findOne({ email });
    if (userExists) return res.status(400).json({ error: 'Already exist' });

    const encryptHash = sha1(password);
    const createUser = await dbClient.client.db('files_manager').collection('users').insert({ email, password: encryptHash });
    return res.status(201).json({ id: createUser.ops[0]._id, email: createUser.ops[0].email });
  }

  static async getMe(req, res) {
    const token = req.header('X-Token');
    const encryptUuid = await RedisClient.get(`auth_${token}`);

    if (!encryptUuid) return res.status(401).json({ error: 'Unauthorized' });
    const usr = await dbClient.userFind({ _id: ObjectId(encryptUuid) });
    return res.json({ email: usr.email, id: usr._id });
  }
}

export default UsersController;
