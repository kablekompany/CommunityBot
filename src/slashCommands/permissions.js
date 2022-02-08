const { MessageEmbed } = require('discord.js');
const CommandOptionType = require('../utils/CommandOptionType');

module.exports = {
	name: 'permissions',
	description: 'Change / commands permissions',
	default_permission: false,
	options: [
		{
			name: 'role',
			type: CommandOptionType.Role,
			description: 'Which role?',
			required: true
		},
		{
			name: 'command',
			type: CommandOptionType.String,
			description: 'Which command?',
			required: true
		}
	],

	async execute(interaction) {
		const commands = await interaction.guild.commands.fetch();
		const command = commands.find(
			(c) => c.name === interaction.options.getString('command', true)
		);

		if (!command) {
			return interaction.reply({
				embeds: [
					new MessageEmbed()
						.setColor(0x2f3136)
						.setDescription('This command does not exist')
				]
			});
		}

		const role = interaction.options.getRole('role', true);
		const hasPermission = await command.permissions.has({
			command: command.id,
			permissionId: role.id
		});

		if (hasPermission) {
			await command.permissions.remove({
				roles: [role.id]
			});
		} else {
			await command.permissions.add({
				permissions: [
					{
						id: role.id,
						type: 'ROLE',
						permission: !hasPermission
					}
				]
			});
		}

		await interaction.reply({
			embeds: [
				new MessageEmbed()
					.setColor(0x2f3136)
					.setDescription(
						hasPermission
							? `Removed \`/${command.name}\` from \`${role.name}\``
							: `Added \`/${command.name}\` to \`${role.name}\``
					)
			]
		});
	}
};
