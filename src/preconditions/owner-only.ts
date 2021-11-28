import { type Command, Precondition } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { type Message } from 'discord.js';

@ApplyOptions<Precondition.Options>({ name: 'OwnerOnly' })
export default class extends Precondition {
	public run(msg: Message, command: Command) {
		const isOwner = this.container.config.owners.includes(msg.author.id);
		return isOwner ? this.ok() : this.error({ message: 'The user is not a bot owner.' });
	}
}

declare module '@sapphire/framework' {
	interface Preconditions {
		OwnerOnly: never;
	}
}