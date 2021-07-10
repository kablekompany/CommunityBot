import { Intents } from 'discord.js';
import Bot from './models/Client';

const intents = new Intents().add(
	'GUILDS',
  'GUILD_BANS',
  'GUILD_EMOJIS',
  'GUILD_INVITES',
  'GUILD_MEMBERS',
  'GUILD_MESSAGES',
  'GUILD_MESSAGE_REACTIONS',
  'DIRECT_MESSAGES'
);

new Bot(process.env.DISCORD_TOKEN, { intents }).launch();