import { MongoClient, Db } from 'mongodb';
import { Guilds } from './collections/GuildCollection';
import { Users } from './collections/UserCollection';
import Bot from '../models/Client';

export class Database {
  public connection: MongoClient;
  public guilds: Guilds;
  public users: Users;
  public db: Db;

  public constructor() {
    this.connection = null;
    this.db = null;
  }

  public async bootstrap(config: Bot['config']) {
    const conn = await MongoClient.connect(config.mongo, {
      useUnifiedTopology: true,
    });

    this.connection = null;
    this.db = conn.db();

    this.guilds = new Guilds(this.db.collection('guild'));
    return this;
  }
}
