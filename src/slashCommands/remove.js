const CommandOptionType = require('../utils/CommandOptionType');

module.exports = {
  name: 'remove',
  description: 'Remove a specific track',
  options: [
    {
      name: 'track',
      description: 'The number of the track to remove',
      type: CommandOptionType.Integer,
      required: true
    }
  ],
  default_permission: false,

  async execute(interaction) {
    const { client } = interaction;

    await interaction.deferReply();

    const queue = client.player.getQueue(interaction.guildId);
    if (!queue) {
      return interaction.editReply({
        embeds: [{ description: '❌ | No music is being played!' }]
      });
    }

    const trackIndex = interaction.options.getInteger('track') - 1;
    const trackName = queue.tracks[trackIndex].title;
    queue.remove(trackIndex);

    return interaction.editReply({
      embeds: [{ description: `❌ | Removed track ${trackName}.` }]
    });
  }
};
