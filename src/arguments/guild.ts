import { ApplyOptions } from '@sapphire/decorators';
import { Argument } from '@sapphire/framework';

import { isNullOrUndefined } from '@sapphire/utilities';
import { type Guild } from 'discord.js';

export default class extends Argument {
	public async run(parameter: string, ctx: Argument.Context) {
		const resolved = await this.resolveById(parameter) ?? await this.resolveByName(parameter);
		return !isNullOrUndefined(resolved) ? this.ok(resolved) : this.error({ parameter, message: 'The argument did not resolve to a guild.' });
	}

	private resolveById(query: string) {
		const cached = this.container.client.guilds.resolve(query);
		return cached ? this.container.client.guilds.fetch(cached.id) : null;
	}

	private async resolveByName(query: string) {
		const allGuilds = await this.container.client.guilds.fetch();
		const lowerCased = query.toLowerCase();

		for (const guild of allGuilds.values()) {
			const caseSpecific = guild.name.toLowerCase() === lowerCased;
			const includes = guild.name.toLowerCase().includes(lowerCased);

			if (caseSpecific || includes) return guild;
		}

		return null;
	}
}

declare module '@sapphire/framework' {
	interface ArgType {
		guild: Guild;
	}
}