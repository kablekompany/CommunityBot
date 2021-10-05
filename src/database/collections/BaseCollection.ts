import {
  Collection,
  Condition,
  FilterQuery,
  Cursor,
  InsertWriteOpResult,
} from 'mongodb';

export interface BaseModel {
  /**
   * The id of this model.
   */
  _id: any;
}

export class BaseCollection<Model extends BaseModel> {
  public collection: Collection;
  public readonly default: Model;

  public constructor(collection: Collection, def: Omit<Model, '_id'>) {
    Reflect.defineProperty(this, 'default', { value: def });
    this.collection = collection;
  }

  public init(_id: string) {
    return this.collection
      .insertOne({ _id, ...this.default })
      .then((i) => i.ops[0] as Model);
  }

  public find(query: FilterQuery<Model>): Promise<Model[]> {
    return this.collection.find({ ...query }).toArray();
  }

  public get(_id: string): Promise<Model> {
    return this.collection
      .findOne({ _id })
      .then((found) => ({ ...this.default, ...found }));
  }

  public getAll(): Promise<Model[]> {
    return this.collection.find({}).toArray();
  }

  public getLatest(): Promise<Model[]> {
    return this.collection.find({}, { sort: { $natural: -1 } }).toArray();
  }

  public update(_id: string, query: FilterQuery<Model>) {
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
