import Bot from './models/Client';

new Bot(process.env.DISCORD_TOKEN, { intents: 5711 }).launch();
