import { BaseCollection } from './BaseCollection';
import { Collection } from 'mongodb';

export class Guilds extends BaseCollection {
	public constructor(collection: Collection) {
		super(collection, {
			prefix: 'd!',
			commands: 0
		});
	}

	public initGuild(_id: string) {
		return this.collection.insertOne({ _id, ...this.default });
	}

	public async getGuild(_id: string) {
		return await this.get(_id) ?? this.initGuild(_id);
	}

	public updatePrefix(_id: string, prefix: string) {
		return this.update(_id, { $set: { prefix } }).then(r => r.result);
	}
}