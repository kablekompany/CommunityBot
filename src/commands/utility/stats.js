const Command = require('../../models/Command/CommandModel');

module.exports = new Command(
  async ({ ctx }) => {
    const { bot } = ctx;
    return {
      fields: [
        {
          name: 'Cache',
          value:
            `**Channels**: ${
              bot.channels.cache.filter((c) => c.type === 'GUILD_TEXT').size
            }\n` +
            `**Emotes**: ${bot.emojis.cache.size}\n` +
            `**Guilds**: ${bot.guilds.cache.size}\n` +
            `**Users**: ${bot.users.cache.size.toLocaleString()}\n`,
          inline: false,
        },
        {
          name: 'Latency',
          value:
            `**Uptime**: <t:${Math.round(
              Date.now() / 1000 - process.uptime(),
            )}:R>\n` +
            `**Shard online since**: ${ctx.utils.relativeTime(bot.readyAt)}\n` +
            `**Ping**: ${Math.round(bot.ws.ping)}\n`,
        },
      ],
      title: 'Bot Statistics',
      thumbnail: {
        url: bot.user.avatarURL({ dynamic: true, size: 1024 }),
      },
    };
  },
  {
    name: 'stats',
    usage: 'view bot stats',
    adminOnly: true,
  },
);
