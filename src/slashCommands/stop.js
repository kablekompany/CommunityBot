module.exports = {
  name: 'stop',
  description: 'Stop the player',

  async execute(interaction) {
    const { client } = interaction;

    await interaction.deferReply();
    const queue = client.player.getQueue(interaction.guildId);
    if (!queue || !queue.playing) {
      return interaction.editReply({
        embeds: [{ description: '❌ | No music is being played!' }],
      });
    }
    queue.destroy();
    return interaction.editReply({
      embeds: [{ description: '🛑 | Stopped the player!' }],
    });
  },
};
