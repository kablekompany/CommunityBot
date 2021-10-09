/* eslint-disable no-unused-expressions */
const { QueryType } = require('discord-player');
const CommandOptionType = require('../utils/CommandOptionType');

module.exports = {
  async execute(interaction) {
    const { client, guild } = interaction;
    await interaction.deferReply();
    const query = interaction.options.getString('query', true);
    const searchResult = await client.player
      .search(query, {
        requestedBy: interaction.user.tag,
        searchEngine: QueryType.AUTO,
      })
      .catch((e) => {
        console.error(e.message);
      });
    if (!searchResult || !searchResult.tracks.length) {
      return interaction.editReply({
        embeds: [
          {
            description: `No results were found ${interaction.user.tag}, try something else maybe?`,
          },
        ],
      });
    }

    await interaction.editReply({
      embeds: [
        {
          description: `⏱ | Loading your ${
            searchResult.playlist ? 'playlist' : 'track'
          }...`,
        },
      ],
    });

    const queue = await client.player.createQueue(guild, {
      metadata: interaction,
    });

    try {
      if (!queue.connection) {
        await queue.connect(interaction.member.voice.channel);
      }
    } catch (err) {
      client.player.deleteQueue(interaction.guildId);
      return interaction.editReply({
        embeds: [
          {
            description: 'Could not join your voice channel!',
          },
        ],
      });
    }

    searchResult.playlist
      ? queue.addTracks(searchResult.tracks)
      : queue.addTrack(searchResult.tracks[0]);
    if (!queue.playing) {
      await queue.play();
    }
    return null;
  },
  name: 'play',
  description: 'Play a song from youtube',
  options: [
    {
      name: 'query',
      type: CommandOptionType.String,
      description: 'The song you want to play',
      required: true,
    },
  ],
};
