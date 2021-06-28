const { MongoClient } = require('mongodb');
const Guilds = require('./Collections/Guilds');

class Database {
  constructor() {
    this.db = null;
    this.guilds = null;
  }

  async bootstrap(config) {
    const dbConn = await MongoClient.connect(config.mongo, {
      useUnifiedTopology: true,
    });
    this.db = dbConn.db();
    this.guilds = new Guilds(this.db.collection('guilds'));
  }
}

module.exports = Database;
