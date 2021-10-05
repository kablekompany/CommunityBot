import type { IProps, IModel, IBaseDocument, IDocument } from '../../Interface';
import type { Guild } from 'discord.js';

export interface GuildProfile extends IProps {
  /**
   * Represents the guild's prefix to use the bot.
   */
  prefix: string;
  /**
   * Represents the amount of commands ran within this guild.
   */
  commands: number;
}

export interface GuildBaseDocument extends IBaseDocument, GuildProfile {
  /**
   * The guild.
   */
  guild: Guild | null;
}

export interface GuildDocument extends IDocument, GuildBaseDocument {
  /**
   * Sets the new prefix for the guild.
   * @param prefix - The new prefix.
   */
  setPrefix: (prefix: string) => this;
  /**
   * Increment the commands ran by this guild.
   * @param by - The amount to increment.
   */
  incCommands: (by?: number) => this;
}

export interface GuildModel extends IModel<GuildDocument> {
  /**
   * Fetches the guild directly from the model.
   * @param id - The id of the guild to fetch.
   */
  getGuild(id: string): Promise<GuildDocument>;
}
