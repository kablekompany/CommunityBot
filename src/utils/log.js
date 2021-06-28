module.exports = {
  logmsg: async (bot, msg, channel) => {
    const logChannel = bot.channels.resolve(channel);
    const title =
      msg.author.id !== bot.id
        ? `Received DM from ${msg.author.tag}`
        : `Sent DM to ${msg.author.tag}`;

    const description = [];
    if (msg.content) {
      description.push(`**Content**:\n${msg.content}`);
    }

    let { attachments } = msg;
    if (attachments.size) {
      attachments = attachments
        .map(
          (attachment, index) =>
            `[\`Attachment - ${index}\`](${attachment.url})`,
        )
        .join('\n');
      description.push(`**Attachments:\n${attachments}**`);
    }

    await logChannel.send({
      embed: {
        description: description.join('\n\n'),
        title,
        color: title.startsWith('Received')
          ? Number(0x039be5)
          : Number(0xdb4647),
      },
    });
  },
};
