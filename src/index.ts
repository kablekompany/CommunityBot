import { container, SapphireClient } from '@sapphire/framework';
import { type Config, config } from '#dmc/config';
import { Database } from '#dmc/db';
import { Player } from 'discord-player';
import { join } from 'path';

declare module '@sapphire/pieces' {
	interface Container {
		config: Config;
		db: Database;
		player: Player;
	}
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DISCORD_TOKEN: string;
    }
  }
}


const dmc = new SapphireClient({ 
	baseUserDirectory: join(process.cwd(), 'src'),
	intents: 5711,
});

container.config = config;
container.db = new Database(dmc);
container.player = new Player(dmc);

await dmc.login();