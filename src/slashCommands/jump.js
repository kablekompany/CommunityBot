const CommandOptionType = require('../utils/CommandOptionType');

module.exports = {
  name: 'jump',
  description: 'Jump to a specific track',
  options: [
    {
      name: 'tracks',
      description: 'The number of tracks to skip',
      type: CommandOptionType.Integer,
      required: true,
    },
  ],

  async execute(interaction) {
    const { client } = interaction;
    await interaction.deferReply();
    const queue = client.player.getQueue(interaction.guildId);
    if (!queue || !queue.playing) {
      return interaction.editReply({
        embeds: [{ description: '❌ | No music is being played!' }],
      });
    }

    const tracks = interaction.options.getInteger('tracks');
    const trackIndex = tracks - 1;
    const trackName = queue.tracks[trackIndex]?.title;

    if (!trackName) {
      return interaction.editReply(
        `\`${tracks}\` is an invalid queue position.`,
      );
    }
    queue.jump(trackIndex);
    return interaction.editReply({
      embeds: [
        {
          description: `⏭ | ${interaction.user.username} has jumped to **${trackName}** in the queue!`,
        },
      ],
    });
  },
};
