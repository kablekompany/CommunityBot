const { MongoClient } = require('mongodb');
const Users = require('./Collections/Users');
const Guilds = require('./Collections/Guilds');
const Logs = require('./Collections/Logs');
// const Submissions = require('./Collections/Submissions');

class Database {
  constructor() {
    this.db = null;
    this.users = null;
    this.guilds = null;
    this.logs = null;
  }

  async bootstrap(mongoURI) {
    const dbConn = await MongoClient.connect(mongoURI, {
      useUnifiedTopology: true,
    });
    this.db = dbConn.db();
    this.users = new Users(this.db.collection('users'));
    this.guilds = new Guilds(this.db.collection('guilds'));
    this.logs = new Logs(this.db.collection('logs'));
    // this.submissions = new Submissions(this.db.collection('submissions'));
  }
}

module.exports = Database;
