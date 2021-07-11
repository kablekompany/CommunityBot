import { MessageHandler } from '../../../models/handler/MessageHandler';
import { Message, Snowflake } from 'discord.js';

export default new MessageHandler(
	async function (msg: Message) {
		if (msg.channel.type !== 'DM') return null; // is null intentional?
		const { dmLog } = this.config.log;
		if (!dmLog.enabled) return null;

		await this.utils.logMsg(msg, dmLog.channel as Snowflake);
		return null;
	}, {
	name: 'dm',
	allowDM: true,
	allowBot: false
});