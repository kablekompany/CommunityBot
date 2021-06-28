async function ready() {
  console.log(
    `${this.bot.user.tag} is up and running at ${this.utils.prettyDate()}`,
  );
  const { log } = this.config;
  this.bot.user
    .setActivity('you', {
      type: 'WATCHING',
    });
  if (!log.bootLog.enabled) {
    return null;
  }

  const guilds = this.bot.guilds.cache.map((g) => `[\`${g.id}\`] - ${g.name}`);
  const pages = this.utils.paginate(guilds);

  await Promise.all(
    pages.map(async (page, index, array) => {
      const storage = this.bot.channels.resolve(log.bootLog.channel);
      await storage.send({
        embed: {
          title: 'Servers:',
          author: {
            name: `${this.bot.user.tag} is online`,
          },
          description: page,
          footer: {
            text: `Page ${index + 1} of ${array.length}`,
          },
          timestamp: new Date(),
        },
      });
    }),
  );
  return null;
}

module.exports = ready;
