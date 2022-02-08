module.exports = {
	name: 'help',
	description: 'Show all slash commands for music.',
	default_permission: false,

	async execute(interaction) {
		await interaction.deferReply();
		return interaction.editReply({
			embeds: [
				{
					title: 'All Music Commands',
					description: `${interaction.client.slashCmds
						.map((cmd) => `- \`/${cmd.name}\` - ${cmd.description}`)
						.join('\n')}`
				}
			]
		});
	}
};
