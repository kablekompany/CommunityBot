module.exports = {
  name: 'np',
  description: "See what's currently being played",
  default_permission: false,

  async execute(interaction) {
    const { client } = interaction;

    const queue = client.player.getQueue(interaction.guildId);
    if (!queue || !queue.playing) {
      return interaction.reply({
        embeds: [{ description: '❌ | No music is being played!' }],
        ephemeral: true
      });
    }
    const progress = queue.createProgressBar();
    const perc = queue.getPlayerTimestamp();

    return interaction.reply({
      embeds: [
        {
          title: 'Now Playing',
          description: `🎶 | **${queue.current.title}**! (\`${
            perc.progress === 'Infinity' ? 'Live' : `${perc.progress}%`
          }\`)`,
          fields: [
            {
              name: '\u200b',
              value: progress.replace(/ 0:00/g, ' ◉ LIVE')
            }
          ],
          color: 0xffffff
        }
      ]
    });
  }
};
