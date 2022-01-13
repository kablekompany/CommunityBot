const CommandOptionType = require('../utils/CommandOptionType');

module.exports = {
  /**
   * @param {import('discord.js').CommandInteraction} interaction interaction received by the API
   * @param {import('../models/Bot/BotModel')} ctx
   */
  async execute(interaction, ctx) {
    if (!interaction.member.roles.cache.has(ctx.config.dmc.modRole)) {
      return interaction.reply({
        content: "You're missing the **Moderator** role.",
        ephemeral: true
      });
    }

    const member = interaction.options.getMember('member', true);
    const reason = interaction.options.getString('reason', true);
    const time = interaction.options.getString('time', true);
    let milliseconds;

    try {
      milliseconds = ctx.utils.validateTime(time);
    } catch (err) {
      return interaction.reply({
        content: 'This seems like an invalid time, try again maybe?',
        ephemeral: true
      });
    }

    try {
      await member.timeout(milliseconds, reason);
    } catch (err) {
      return interaction.reply({
        embeds: [
          {
            description: `I was unable to timeout this member.\n\nError: ${err.message}`,
            color: 0xd3403d // red
          }
        ],
        ephemeral: true
      });
    }

    const endTime = ctx.utils.relativeTime(Date.now() + milliseconds);
    member
      .send({
        embeds: [
          {
            title: `You've been timed out in ${interaction.guild.name}`,
            description: `Reason: ${reason}\n\nTimeout ends ${endTime}`,
            color: 0xed7438 // orange
          }
        ]
      })
      .catch(() => null);

    const modlog = ctx.bot.channels.resolve(ctx.config.dmc.modlog);
    modlog.send({
      embeds: [
        {
          title: `timeout | ${ctx.utils.parseTime(milliseconds / 1000)}`,
          description:
            `**Offender:** ${member.user.tag} <@${member.id}>\n` +
            `**Reason:** ${reason}\n` +
            `**Responsible moderator:** ${interaction.user.tag}`,
          color: 15960130,
          timestamp: new Date(),
          footer: { text: `ID: ${member.id}` }
        }
      ]
    });

    return interaction.reply({
      embeds: [
        {
          title: 'Timeout Successful',
          description: `**${member.user.tag}**'s timeout ends **${endTime}**`,
          color: 0x89ff7a // green
        }
      ],
      ephemeral: true
    });
  },
  name: 'timeout',
  description: 'Timeout a user for a specified duration with a reason.',
  options: [
    {
      name: 'member',
      type: CommandOptionType.User,
      description: 'The member you would like to timeout',
      required: true
    },
    {
      name: 'reason',
      type: CommandOptionType.String,
      description: 'The reason for the timeout',
      required: true
    },
    {
      name: 'time',
      type: CommandOptionType.String,
      description: 'The duration of the timeout',
      required: true
    }
  ]
};
