module.exports = {
  name: 'skip',
  description: 'Skip to the current song',

  async execute(interaction) {
    const { client } = interaction;

    await interaction.deferReply();
    const queue = client.player.getQueue(interaction.guildId);
    if (!queue || !queue.playing) {
      return interaction.editReply({
        embeds: [{ description: '❌ | No music is being played!' }],
      });
    }
    const currentTrack = queue.current;
    const success = queue.skip();
    return interaction.editReply({
      embeds: [
        {
          description: success
            ? `✅ | ${interaction.user.username} has skipped **${currentTrack}**!`
            : '❌ | Something went wrong!',
        },
      ],
    });
  },
};
