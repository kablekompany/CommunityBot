const CommandOptionType = require('../utils/CommandOptionType');

module.exports = {
  name: 'queue',
  description: 'See the queue',
  options: [
    {
      name: 'page',
      type: CommandOptionType.Integer,
      description: 'Specify page number in queue',
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
        embeds: [
          {
            description: '❌ | No music is being played!'
          }
        ]
      });
    }
    let pageStart;
    if (!interaction.options.page) pageStart = 1;
    pageStart = 10 * (interaction.options.getInteger('page') - 1);
    const pageEnd = pageStart + 10;
    const currentTrack = queue.current;
    const tracks = queue.tracks
      .slice(pageStart, pageEnd)
      .map((m, i) => `${i + pageStart + 1}. **${m.title}** ([link](${m.url}))`);

    return interaction.editReply({
      embeds: [
        {
          title: 'Server Queue',
          description: `${tracks.join('\n')}${
            queue.tracks.length > pageEnd
              ? `\n...${queue.tracks.length - pageEnd} more track(s)`
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
