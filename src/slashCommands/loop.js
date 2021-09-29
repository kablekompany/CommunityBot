/* eslint-disable indent */
/* eslint-disable no-nested-ternary */
const { QueueRepeatMode } = require('discord-player');
const CommandOptionType = require('../utils/CommandOptionType');

module.exports = {
  name: 'loop',
  description: 'Set loop mode',
  options: [
    {
      name: 'mode',
      type: CommandOptionType.Integer,
      description: 'Loop type',
      required: true,
      choices: [
        {
          name: 'Off',
          value: QueueRepeatMode.OFF,
        },
        {
          name: 'Track',
          value: QueueRepeatMode.TRACK,
        },
        {
          name: 'Queue',
          value: QueueRepeatMode.QUEUE,
        },
        {
          name: 'Autoplay',
          value: QueueRepeatMode.AUTOPLAY,
        },
      ],
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
    const loopMode = interaction.options.getInteger('mode');
    const success = queue.setRepeatMode(loopMode);
    const mode =
      loopMode === QueueRepeatMode.TRACK
        ? '🔂'
        : loopMode === QueueRepeatMode.QUEUE
        ? '🔁'
        : '▶';
    return interaction.editReply({
      embeds: [
        {
          description: success
            ? `${mode} | Updated loop mode!`
            : '❌ | Could not update loop mode!',
        },
      ],
    });
  },
};
