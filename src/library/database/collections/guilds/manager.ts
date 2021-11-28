import type { GuildModel, GuildDocument, GuildBaseDocument } from './interface';
import { container } from '@sapphire/framework';

type GuildSchema = Schema<GuildDocument, GuildModel, GuildDocument>;

export class GuildManager {
  public static getGuild(this: GuildModel) {
    const thisGuild =
      (await this.findById({ _id: id })) ?? (await this.create({ _id: id }));
    return thisGuild;
  }

  public get guild(this: GuildBaseDocument) {
    return container.client.guilds.cache.get(this) ?? null;
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
