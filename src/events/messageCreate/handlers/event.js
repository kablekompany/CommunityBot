const MessageHandler = require('../../../models/Handlers/MessageHandler');
const { dmc } = require('../../../configs/config.json');

module.exports = new MessageHandler(
	async ({ msg }) => {
		const immune = [dmc.adminRole, dmc.communityManagerRole];
		if (msg.channel.id !== dmc.events) {
			return null;
		}

		const isImmune = immune.some((i) => msg.member.roles.cache.has(i));
		if (!msg.content.match(/^pls (share|gift|give|yeet)/gi) && !isImmune) {
			await msg.delete();
		}

		return null;
	},
	{
		name: 'event',
		allowDM: false,
		allowBot: false
	}
);
