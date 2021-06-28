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
              bot.channels.cache.filter((c) => c.type === 'text').size
            }\n` +
            `**Emotes**: ${bot.emojis.cache.size}\n` +
            `**Guilds**: ${bot.guilds.cache.size}\n` +
            `**Users**: ${bot.users.cache.size}\n`,
          inline: false,
        },
        {
          name: 'Latency',
          value:
            `**Uptime**: ${ctx.utils.parseTime(
              Math.round(bot.uptime / 1000),
            )}\n` +
            `**Shard online since**: ${ctx.utils.parseDate(bot.readyAt)}\n` +
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
    ownerOnly: true,
  },
);
