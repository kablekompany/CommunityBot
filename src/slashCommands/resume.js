module.exports = {
  name: 'resume',
  description: 'Resume the current song',

  async execute(interaction) {
    const { client } = interaction;
    await interaction.deferReply();
    const queue = client.player.getQueue(interaction.guildId);
    if (!queue || !queue.playing) {
      return interaction.editReply({
        embeds: [{ description: '❌ | No music is being played!' }],
      });
    }
    const paused = queue.setPaused(false);
    return interaction.editReply({
      embeds: [
        { description: paused ? '▶ | Resumed!' : '❌ | Something went wrong!' },
      ],
    });
  },
};
