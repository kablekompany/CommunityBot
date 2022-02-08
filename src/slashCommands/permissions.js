module.exports = {
	name: 'permissions',
	description: 'Change / commands permissions',
	default_permission: false,

	async execute(interaction) {
		await interaction.reply({
			embeds: [
				{
					title: 'pong!',
					description: `**Discord API Websocket Ping**: \`${Math.round(
						interaction.client.ws.ping
					)}ms\`.`
				}
			]
		});
	}
};
