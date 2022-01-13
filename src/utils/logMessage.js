module.exports = {
  logMessage: async (bot, msg, channel) => {
    const logChannel = bot.channels.resolve(channel);

    const description = [];
    if (msg.content) {
      description.push(`**Content**:\n${msg.content}`);
    }

    let { attachments } = msg;
    if (attachments.size) {
      attachments = attachments
        .map(
          (attachment, index) =>
            `[\`Attachment - ${index}\`](${attachment.url})`
        )
        .join('\n');
      description.push(`**Attachments:\n${attachments}**`);
    }

    await logChannel.send({
      embeds: [
        {
          description: description.join('\n\n'),
          title: `Received DM from ${msg.author.tag}`,
          footer: {
            text: msg.author.id
          },
          color: 0x039be5
        }
      ]
    });
  }
};
