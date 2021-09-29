module.exports = {
  name: 'ping',
  description: "pong, get the latency to Discord's API",
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
      ephemeral: true,
    });
  },
};
