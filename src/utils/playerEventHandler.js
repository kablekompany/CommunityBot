module.exports.registerPlayerEvents = (player) => {
  player.on('error', (queue, error) => {
    console.log(
      `[${queue.guild.name}] Error emitted from the queue: ${error.message}`,
    );
  });
  player.on('connectionError', (queue, error) => {
    console.log(
      `[${queue.guild.name}] Error emitted from the connection: ${error.message}`,
    );
  });

  player.on('trackStart', (queue, track) => {
    queue.metadata.followUp({
      embeds: [
        {
          description: `🎶 | Started playing: **${track.title}** in <#${queue.connection.channel.id}>!`,
        },
      ],
    });
  });

  player.on('trackAdd', (queue, track) => {
    queue.metadata.followUp({
      embeds: [{ description: `🎶 | Track **${track.title}** queued!` }],
    });
  });

  player.on('botDisconnect', (queue) => {
    queue.metadata.followUp({
      embeds: [
        {
          description:
            '❌ | I was manually disconnected from the voice channel, clearing queue!',
        },
      ],
    });
  });

  player.on('channelEmpty', (queue) => {
    queue.metadata.followUp({
      embeds: [
        { description: '❌ | Nobody is in the voice channel, leaving...' },
      ],
    });
  });

  player.on('queueEnd', (queue) => {
    queue.metadata.followUp({
      embeds: [{ description: '✅ | Queue finished!' }],
    });
  });
};
