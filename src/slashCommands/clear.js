module.exports = {
  name: 'clear',
  description: 'Clear the current queue.',
  default_permission: false,

  async execute(interaction) {
    const { client } = interaction;

    await interaction.deferReply();

    const queue = client.player.getQueue(interaction.guildId);
    if (!queue) {
      return interaction.editReply({
        embeds: [{ description: '❌ | No music in the queue!' }],
      });
    }

    queue.clear();
    return interaction.editReply({
      embeds: [{ description: '❌ | Queue cleared.' }],
    });
  },
};
