module.exports = {
  name: 'bassboost',
  description: 'Toggle bassboost filter',
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
    await queue.setFilters({
      bassboost: !queue.getFiltersEnabled().includes('bassboost'),
      normalizer2: !queue.getFiltersEnabled().includes('bassboost'), // because we need to toggle it with bass
    });

    return setTimeout(
      () =>
        interaction.editReply({
          embeds: [
            {
              description: `🎵 | Bassboost ${
                queue.getFiltersEnabled().includes('bassboost')
                  ? 'Enabled'
                  : 'Disabled'
              }!`,
            },
          ],
        }),
      queue.options.bufferingTimeout,
    );
  },
};
