const CommandOptionType = require('../utils/CommandOptionType');

module.exports = {
  /**
   * @param {import('discord.js').CommandInteraction} interaction interaction received by the API
   * @param {import('../models/Bot/BotModel')} ctx
   */
  async execute(interaction, ctx) {
    await interaction.deferReply({ ephemeral: true });
    const pollID = interaction.options.getNumber('poll_number');

    const poll = await ctx.db.polls.get(pollID);

    if (!poll.createdBy) {
      return interaction.editReply({
        content: "I wasn't able to find that poll in the database.",
        ephemeral: true
      });
    }

    const choices = Object.values(poll.choices);
    const emotes = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'];
    return interaction.editReply({
      embeds: [
        {
          title: `Poll #${pollID} by ${interaction.user.username}`,
          description: `Question: ${poll.question}\nEnded: ${
            poll.ended === true ? 'yes' : 'no'
          }\n\n${choices
            .map(
              (c, idx) =>
                `${emotes[idx]} — ${c.choice}: **${
                  c.votes?.toLocaleString() ?? 0
                }**`
            )
            .join('\n\n')}`
        }
      ]
    });
  },
  name: 'viewpoll',
  description: 'View stats for a poll',
  default_permission: false,
  options: [
    {
      name: 'poll_number',
      type: CommandOptionType.Number,
      description: "The poll's ID",
      required: true
    }
  ]
};
