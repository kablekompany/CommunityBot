import { MessageHandler } from '../../../models/handler/MessageHandler';
import { Message, Snowflake, TextChannel } from 'discord.js';

export default new MessageHandler(
	async function (msg: Message) {
		const { general, modRole, trialMod, dramaWatcher } = this.config.dmc;
		if (msg.channel.id !== general) return null;

		const hasRole = (r: Snowflake) => msg.member.roles.cache.has(r);
		const filter = msg.content.toLowerCase().includes('pls') && hasRole(modRole as Snowflake);
		if (filter) return null;

		if (msg.content.match(/(dm me|pm me|msg me)/gi)) {
			const modRoles = [modRole, trialMod];
			if (modRoles.some(mr => hasRole(mr as Snowflake))) {
				return null;
			}

			await msg.delete();
			this.utils.muteMember(msg);
			const dramas = this.bot.channels.resolve(dramaWatcher as Snowflake);
			return (dramas as TextChannel).send({ embeds: [{
				title: 'DM Message Deleted',
				description: [
					`**${msg.author.tag}** (\`${msg.author.id}\`) said:`,
					this.utils.codeblock(msg.content),
					`Channel: ${msg.channel.toString()}`,
					'User has been muted for **20 minutes**.'
				].join('\n'),
				timestamp: Date.now(),
				color: 15705088
			}]})
		}

		return null;
	}, {
	name: 'general',
	allowDM: false,
	allowBot: false
});