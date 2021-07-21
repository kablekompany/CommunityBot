import { BaseCollection, BaseModel } from './BaseCollection';
import { Collection } from 'mongodb';

export interface GuildModel extends BaseModel {
  prefix: string;
  commands: number;
}

export class Guilds extends BaseCollection<GuildModel> {
  public constructor(collection: Collection) {
    super(collection, {
      prefix: 'd!',
      commands: 0,
    });
  }

  public initGuild(_id: string) {
    return this.collection.insertOne({ _id, ...this.default });
  }

  public async getGuild(_id: string) {
    return (await this.get(_id)) ?? this.initGuild(_id);
  }

  public updatePrefix(_id: string, prefix: string) {
    return this.update(_id, { $set: { prefix } }).then((r) => r.result);
  }
}
