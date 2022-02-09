const { MessageEmbed } = require('discord.js');
const colors = require('../utils/colors');

module.exports = {
	name: 'help',
	description: 'Show all slash commands.',
	default_permission: false,

	async execute(interaction) {
		return interaction.reply({
			embeds: [
				new MessageEmbed()
					.setTitle('All Slash Commands')
					.setColor(colors.invisible)
					.setDescription(
						interaction.client.slashCmds
							.map(
								(cmd) => `\`/${cmd.name}\` - ${cmd.description}`
							)
							.join('\n')
					)
			]
		});
	}
};
