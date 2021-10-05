import type { GuildModel, GuildDocument, GuildBaseDocument } from './interface';
import type { GuildCollection } from './collection';
import mongoose from 'mongoose';

const { model, Schema } = mongoose;

export default (collection: GuildCollection): GuildModel => {
  const GuildSchema = new Schema<GuildDocument, GuildModel, GuildDocument>({
    prefix: {
      type: String,
      default: config.prefix,
    },
    commands: {
      type: Number,
      default: 0,
    },
  });

  GuildSchema.virtual('guild').get(function (this: GuildBaseDocument) {
    return collection.db.client.guilds.cache.get(this._id) ?? null;
  });

  /**
   * Fetches the guild directly from the model.
   * @param this - The guild model.
   * @param id - The id of the guild to fetch.
   */
  GuildSchema.statics.getGuild = async function (this: GuildModel, id: string) {
    const thisGuild =
      (await this.findById({ _id: id })) ?? (await this.create({ _id: id }));
    return thisGuild;
  };

  /**
   * Sets the new prefix for the guild.
   * @param this - The guild's document entry from the database.
   * @param prefix - The new prefix.
   */
  GuildSchema.methods.setPrefix = function (
    this: GuildDocument,
    prefix: string,
  ) {
    this.prefix = prefix;
    return this;
  };

  /**
   * Increment the commands ran by this guild.
   * @param this - The guild's document entry from the database.
   * @param by - The amount to increment.
   */
  GuildSchema.methods.incCommands = function (
    this: GuildDocument,
    by?: number,
  ) {
    this.commands += by ?? 1;
    return this;
  };

  return model<GuildDocument, GuildModel>('guild', GuildSchema);
};
