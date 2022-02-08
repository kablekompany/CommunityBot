const Command = require('../../models/Command/CommandModel');

module.exports = new Command(({ ctx }) => `\`${ctx.bot.ws.ping}\`ms`, {
	name: 'ping',
	usage: '<command>',
	adminOnly: true,
	argReq: false
});
