import { container, SapphireClient } from '@sapphire/framework';
import { type Config, config } from '#dmc/config';
import { SlashStore } from '#dmc/structures';
import { BotUtils } from '#dmc/client';
import { Database } from '#dmc/db';
import { Player } from 'discord-player';
import { join } from 'path';

declare module '@sapphire/pieces' {
  interface Container {
    config: Config;
    db: Database;
    player: Player;
    util: BotUtils;
  }
}

const dmc = new SapphireClient({
  defaultPrefix: config.prefix,
  baseUserDirectory: join(process.cwd(), 'src'),
  intents: 5711,
});

container.config = config;
container.util = new BotUtils();
container.db = new Database(dmc);
container.player = new Player(dmc);

dmc.stores.register(new SlashStore());

await dmc.login();
