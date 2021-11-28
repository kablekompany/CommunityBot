const { QueryType } = require('discord-player');
const CommandOptionType = require('../utils/CommandOptionType');

module.exports = {
  name: 'playnext',
  description: 'Add a song to the top of the queue',
  options: [
    {
      name: 'query',
      type: CommandOptionType.String,
      description: 'The song you want to play next',
      required: true,
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

    const { query } = interaction.options;
    const searchResult = await client.player
      .search(query, {
        requestedBy: interaction.user,
        searchEngine: QueryType.AUTO,
      })
      .catch(() => null);

    if (!searchResult || !searchResult.tracks.length) {
      return interaction.editReply({
        embeds: [{ description: 'No results were found!' }],
      });
    }
    queue.insert(searchResult.tracks[0]);
    return interaction.editReply({
      embeds: [{ description: '⏱ | Loading your track...' }],
    });
  },
};
