import type { CommandOptions, Args } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';

@ApplyOptions<CommandOptions>({
	name: 'eval'
})
export default class extends Command<Args> {
	public async run(msg: Message, args: Args) {
		return msg.reply('no');
	}
}