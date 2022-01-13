const CommandOptionType = require('../utils/CommandOptionType');

module.exports = {
  name: 'history',
  description: 'Display the queue history',
  options: [
    {
      name: 'page',
      type: CommandOptionType.Integer,
      description: 'Specific page number in queue history',
      required: false
    }
  ],
  default_permission: false,

  async execute(interaction) {
    const { client } = interaction;

    await interaction.deferReply();
    const queue = client.player.getQueue(interaction.guildId);
    if (!queue || !queue.playing) {
      return interaction.editReply({
        embeds: [{ description: '❌ | No music is being played!' }]
      });
    }
    if (!interaction.options.page) interaction.options.page = 1;
    const pageEnd = -10 * (interaction.options.getInteger('page') - 1) - 1;
    const pageStart = pageEnd - 10;
    const currentTrack = queue.current;
    const tracks = queue.previousTracks
      .slice(pageStart, pageEnd)
      .reverse()
      .map((m, i) => `${i + pageEnd * -1}. **${m.title}** ([link](${m.url}))`);

    return interaction.editReply({
      embeds: [
        {
          title: 'Server Queue History',
          description: `${tracks.join('\n')}${
            queue.previousTracks.length > pageStart * -1
              ? `\n...${queue.previousTracks.length + pageStart} more track(s)`
              : ''
          }`,
          fields: [
            {
              name: 'Now Playing',
              value: `🎶 | **${currentTrack.title}** ([link](${currentTrack.url}))`
            }
          ]
        }
      ]
    });
  }
};
