const ms = require('ms');
/**
 * @param {import('discord.js').GuildMember} member
 * @returns
 */
async function guildMemberAdd(member) {
	const guildIDs = [this.config.dmo.guildID, this.config.dmc.guildID];
	if (
		!guildIDs.includes(member.guild.id) ||
		!(
			Date.now() - member.user.createdTimestamp <
			ms(this.config.minimumAccountAge)
		)
	) {
		return null;
	}

	const embeds = [
		{
			title: 'kick',
			description:
				`**Offender:** ${member.user.tag} <@${member.id}>\n` +
				'**Reason:** Account too young.\n' +
				`**Responsible moderator:** ${this.bot.user.tag}`,
			color: 15960130,
			timestamp: new Date(),
			footer: { text: `ID: ${member.id}` }
		}
	];

	await member.kick('Account too young');
	if (member.guild.id === this.config.dmc.guildID) {
		const dmcModlogs = this.bot.channels.resolve(this.config.dmc.modlog);
		return dmcModlogs.send({
			embeds
		});
	}

	const dmoModlogs = this.bot.channels.resolve(this.config.dmo.modlog);
	return dmoModlogs.send({
		embeds
	});
}

module.exports = guildMemberAdd;
