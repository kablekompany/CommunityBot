import { MongoClient, Db } from 'mongodb';
import Bot from '../models/Client';

export class Database {
	public connection: MongoClient;
	public db: Db;

	public constructor() {
		this.connection = null;
		this.db = null;
	}

	public async bootstrap(config: Bot['config']) {
		const conn = await MongoClient.connect(config.mongo, {
			useUnifiedTopology: true
		});

		this.connection = null;
		this.db = conn.db();
		return this;
	}
}