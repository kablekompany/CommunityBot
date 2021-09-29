module.exports = {
  name: 'shuffle',
  description: 'Shuffle the queue',

  async execute(interaction) {
    const { client } = interaction;

    await interaction.deferReply();

    const queue = client.player.getQueue(interaction.guildId);
    if (!queue || !queue.playing) {
      return interaction.editReply({
        embeds: [{ description: '❌ | No music is being played!' }],
      });
    }
    await queue.shuffle();
    return interaction.editReply({
      embeds: [{ description: '✅ | Queue has been shuffled!' }],
    });
  },
};
