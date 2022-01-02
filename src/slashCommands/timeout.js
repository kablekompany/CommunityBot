const ms = require('ms');
const CommandOptionType = require('../utils/CommandOptionType');

module.exports = {
  /**
   * @param {import('discord.js').CommandInteraction} interaction interaction received by the API
   * @param {import('../models/Bot/BotModel')} ctx
   */
  async execute(interaction) {
    const member = interaction.options.getMember('user', true);
    const reason = interaction.options.getString('reason', true);
    const time = interaction.options.getString('time', false) ?? '10m';

    const milliseconds = ms(time);
    try {
      await member.timeout(milliseconds, reason);
    } catch (err) {
      return interaction.reply({
        embeds: [
          {
            description: `I was unable to timeout this member.\n\nError: ${err.message}`,
          },
        ],
        ephemeral: true,
      });
    }
    return interaction.reply({
      content: `**${member.user.tag}** has been timed out for ${time}`,
      ephemeral: true,
    });
  },
  name: 'timeout',
  description: 'Timeout a user for a specified duration with a reason.',
  options: [
    {
      name: 'user',
      type: CommandOptionType.User,
      description: "The user you'd like to timeout",
      required: true,
    },
    {
      name: 'reason',
      type: CommandOptionType.String,
      description: 'The reason for the timeout',
      required: true,
    },
    {
      name: 'time',
      type: CommandOptionType.String,
      description: 'The duration of the timeout',
      required: false,
    },
  ],
  default_permission: false,
};
