import type { ClientOptions } from 'discord.js';
import type { Config } from '../../config';
import { SapphireClient } from '@sapphire/framework';
import { Database } from '#dmc/db';
import { config } from '../../config.js';

export class CommunityBot extends SapphireClient {
  public config: Config;
  public database: Database;
  public constructor(options: ClientOptions) {
    super(options);
    this.config = config;
    this.database = new Database(this);
  }

  public async login(token = process.env.DISCORD_TOKEN): ReturnType<SapphireClient['login']> {
    await this.database.bootstrap(this.config.mongoUri);
    await this.stores.load();
    return super.login(token);
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DISCORD_TOKEN: string;
    }
  }
}