import CommunityBot from './models/Client';

new CommunityBot(process.env.DISCORD_TOKEN, { intents: 5711 }).launch();
