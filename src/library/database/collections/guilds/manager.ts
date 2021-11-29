import type { GuildModel, GuildDocument, GuildBaseDocument } from './interface';
import type { Schema } from 'mongoose';
import { container } from '@sapphire/framework';

type GuildSchema = Schema<GuildDocument, GuildModel, GuildDocument>;

export class GuildManager {
  public static async getGuild(this: GuildModel, id: string) {
    const thisGuild =
      (await this.findById({ _id: id })) ?? (await this.create({ _id: id }));
    return thisGuild;
  }

  public get guild() {
    return container.client.guilds.cache.get((this as unknown as GuildBaseDocument)._id) ?? null;
  }

  public setPrefix(this: GuildDocument, prefix: string) {
    this.prefix = prefix;
    return this;
  }

  public incCommands(this: GuildDocument, by = 1) {
    this.commands += by;
    return this;
  }
}
