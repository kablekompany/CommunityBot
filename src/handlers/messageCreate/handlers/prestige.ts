import { Message, MessageEmbed, MessageEmbedOptions } from 'discord.js';
import { MessageHandler } from '../../../models/handler/MessageHandler';

export default new MessageHandler(
	async function (msg: Message) {
		const { prestige, memerID } = this.config.dmc;
		if (msg.channel.id !== prestige) return null;

		const filtur = 
			msg.content.split(' ')[2] === 'Congratulations' && 
			msg.author.id === memerID;

		if (filtur) setTimeout(msg.delete, 3000);
		return null;
	}, {
	name: 'prestige',
	allowDM: false,
	allowBot: true
});