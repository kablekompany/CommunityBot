const CommandOptionType = require('../utils/CommandOptionType');

module.exports = {
  name: 'seek',
  description: 'Seek to the given time',
  options: [
    {
      name: 'time',
      description: 'The time to seek to (in seconds)',
      type: CommandOptionType.Integer,
    },
  ],
  default_permission: false,

  async execute(interaction) {
    const { client } = interaction;

    const queue = client.player.getQueue(interaction.guildId);
    if (!queue || !queue.playing) {
      return interaction.reply({
        embeds: [{ description: '❌ | No music is being played!' }],
        ephemeral: true,
      });
    }

    const time = interaction.options.getInteger('time') * 1000;
    await queue.seek(time);

    return interaction.reply({
      embeds: [
        {
          description: `✅ | ${interaction.user.username} has seeked to \`${
            time / 1000
          }\` seconds`,
        },
      ],
    });
  },
};
