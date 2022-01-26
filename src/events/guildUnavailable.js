/**
 * @param {import('discord.js').Guild} guild
 * @returns
 */
async function guildUnavailable(guild) {
  this.utils.log(`${guild.name} just had an outage`);
}

module.exports = guildUnavailable;
