module.exports = {
  name: 'ping',
  description: "pong, get the latency to Discord's API",
  default_permission: false,

  async execute(interaction) {
    await interaction.reply({
      embeds: [
        {
          title: 'pong!',
          description: `**Discord API Websocket Ping**: \`${Math.round(
            interaction.client.ws.ping,
          )}ms\`.`,
        },
      ],
    });
  },
};
