const { MongoClient } = require('mongodb');

class DBClient {
  constructor() {
    this.client = new MongoClient(`mongodb://${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 27017}/${process.env.DB_DATABASE || 'files_manager'}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    this.client.connect();
  }

  isAlive() {
    const connRedis = this.client.isConnected();
    if (connRedis) {
      return true;
    }
    return false;
  }

  async nbUsers() {
    const countCollection = this.client.db(process.env.DB_DATABASE || 'files_manager').collection('users');
    const result = await countCollection.countDocuments();
    return result;
  }

  async nbFiles() {
    const countCollection = this.client.db(process.env.DB_DATABASE || 'files_manager').collection('files');
    const result = await countCollection.countDocuments();
    return result;
  }
}

const dbClient = new DBClient();
export default dbClient;
