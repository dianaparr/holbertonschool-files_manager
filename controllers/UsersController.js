import sha1 from 'sha1';
import dbClient from '../utils/db';

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
}

export default UsersController;
