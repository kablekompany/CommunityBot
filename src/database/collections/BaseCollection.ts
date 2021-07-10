import { Collection, Condition, FilterQuery } from 'mongodb';

export class BaseCollection {
	public collection: Collection;
	public default: any;

	public constructor(collection: Collection, def: any) {
		Object.defineProperty(this, 'default', { value: def });
		this.collection = collection;
	}

	public find(query: FilterQuery<any>) {
		return this.collection.find({ ...query }).toArray();
	}

	public get(_id: string) {
		return this.collection.findOne({ _id }).then(found => ({ ...this.default, ...found }));
	}

	public getAll() {
		return this.collection.find({});
	}

	public getLatest() {
		return this.collection.find({}, { sort: { $natural: -1 } });
	}

	public update(_id: string, query: FilterQuery<any>) {
		return this.collection.updateOne({ _id }, { ...query }, { upsert: true });
	}

	public inc(_id: string, field: string, amount = 1) {
		return this.update(_id, { $inc: { [field]: amount } });
	}

	public set(_id: string, field: string, amount: number) {
		return this.update(_id, { $set: { [field]: amount } });
	}

	public unset(_id: string, field: string) {
		return this.update(_id, { $unset: { [field]: 0 } });
	}

	public toggle(_id: string, field: string) {
		return this.update(_id, { $xor: { [field]: 1 } });
	}

	public delete(_id: string) {
		return this.collection.deleteOne({ _id });
	}
}