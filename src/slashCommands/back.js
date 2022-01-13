module.exports = {
  name: 'back',
  description: 'Play the previous track',
  default_permission: false,

  async execute(interaction) {
    const { client } = interaction;

    const queue = client.player.getQueue(interaction.guildId);
    if (!queue || !queue.playing) {
      await interaction.reply({
        embeds: [{ description: '❌ | No music is being played!' }],
        ephemeral: true
      });
    }

    await queue.back();
    return interaction.reply({
      embeds: [{ description: '✅ | Playing the previous track!' }]
    });
  }
};
