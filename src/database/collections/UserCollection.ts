import { BaseCollection } from './BaseCollection';
import { Collection } from 'mongodb';

export class Users extends BaseCollection {
	public constructor(collection: Collection) {
		super(collection, {
			reminders: {},
			flags: 0
		});
	}

	public initUser(_id: string) {
		return this.collection.insertOne({ _id, ...this.default });
	}

	public async getUser(_id: string) {
		return await this.get(_id) ?? this.initUser(_id);
	}
}