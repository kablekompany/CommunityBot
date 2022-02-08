const OwnerCommand = require('../../models/Command/OwnerCommand');

module.exports = new OwnerCommand(
	async ({ ctx, msg }) => {
		const commands = await msg.guild.commands.fetch();
		const permissionsCommand = commands.find(
			(c) => c.name === 'permissions'
		);

		for (const owner of ctx.config.owners) {
			permissionsCommand.permissions.add({
				permissions: [
					{
						id: owner,
						type: 'USER',
						permission: true
					}
				]
			});
		}

		return 'done.';
	},
	{
		name: 'setup',
		aliases: []
	}
);
