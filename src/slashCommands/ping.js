const { MessageEmbed } = require('discord.js');
const colors = require('../utils/colors');

module.exports = {
	name: 'ping',
	description: "pong, get the latency to Discord's API",
	default_permission: false,

	async execute(interaction) {
		await interaction.reply({
			embeds: [
				new MessageEmbed()
					.setTitle('Pong! :ping_pong:')
					.setColor(colors.invisible)
					.setDescription(
						`Discord API Websocket Ping: \`${Math.round(
							interaction.client.ws.ping
						)}ms\`.`
					)
			]
		});
	}
};
