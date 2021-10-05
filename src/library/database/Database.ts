import type { CommunityBot } from '#dmc/client';
import { GuildCollection, UserCollection } from './collections/index.js';
import mongoose from 'mongoose';
const { connect } = mongoose;

export class Database {
  public guilds!: GuildCollection;
  public users!: UserCollection;

  /**
   * @param client - A discord.js client instance.
   */
  public constructor(public client: CommunityBot) {}

  /**
   * Establishes a connection to our database.
   * @param uri - Your secure mondodb URI.
   */
  public async bootstrap(uri: string) {
    const conn = await connect(uri);
    this.guilds = new GuildCollection(this);
    this.users = new UserCollection(this);
    return this;
  }
}
