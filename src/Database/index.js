const { MongoClient } = require('mongodb');
const Users = require('./Collections/Users');
const Guilds = require('./Collections/Guilds');

class Database {
  constructor() {
    this.db = null;
    this.users = null;
    this.guilds = null;
  }

  async bootstrap(config) {
    const dbConn = await MongoClient.connect(config.mongo, {
      useUnifiedTopology: true,
    });
    this.db = dbConn.db();
    this.users = new Users(this.db.collection('users'));
    this.guilds = new Guilds(this.db.collection('guilds'));
  }
}

module.exports = Database;
