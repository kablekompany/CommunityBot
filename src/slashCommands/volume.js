const CommandOptionType = require('../utils/CommandOptionType');

module.exports = {
  name: 'volume',
  description: 'Set music volume',
  options: [
    {
      name: 'amount',
      type: CommandOptionType.Integer,
      description: 'The volume amount to set (0-100)',
      required: false,
    },
  ],
  default_permission: false,

  async execute(interaction) {
    const { client } = interaction;

    await interaction.deferReply();
    const queue = client.player.getQueue(interaction.guildId);
    if (!queue || !queue.playing) {
      return interaction.editReply({
        embeds: [{ description: '❌ | No music is being played!' }],
      });
    }
    const vol = parseInt(interaction.options.getInteger('amount'));
    if (!vol) {
      return interaction.editReply({
        embeds: [
          { description: `🎧 | Current volume is **${queue.volume}**%!` },
        ],
      });
    }
    if (vol < 0 || vol > 100) {
      return interaction.editReply({
        embeds: [{ description: '❌ | Volume range must be 0-100' }],
      });
    }
    const success = queue.setVolume(vol);
    return interaction.editReply({
      embeds: [
        {
          description: success
            ? `✅ | Volume set to **${vol}%**!`
            : '❌ | Something went wrong!',
        },
      ],
    });
  },
};
