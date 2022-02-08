async function guildDelete(guild) {
	const { log } = this.config;
	if (!log.bootLog.enabled) return null;
	const joinChannel = this.bot.channels.resolve(log.bootLog.channel);
	joinChannel.send({
		embeds: [
			{
				title: 'Removed from Guild',
				description: `**Guild Name**: ${guild.name}\n**Guild ID**: ${guild.id}\n**Guild Owner**: ${guild.owner.user.tag} [<@${guild.ownerId}>]\n**Guild Member Count**: ${guild.memberCount}`,
				color: this.utils.randomColour(),
				image: {
					url: guild.iconURL({ dynamic: true, size: 1024 })
				}
			}
		]
	});
	return null;
}

module.exports = guildDelete;
