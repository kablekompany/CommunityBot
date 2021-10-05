import type { ClientOptions } from 'discord.js';
import type { Config } from '../config';
import { SapphireClient } from '@sapphire/framework';
import config from '../config.js';

export default class CommunityBot extends SapphireClient {
  public constructor(options: ClientOptions) {
    super(options);
  }

  public async login(
    token = process.env.DISCORD_TOKEN,
  ): ReturnType<SapphireClient['login']> {
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
