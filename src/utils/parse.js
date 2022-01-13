const ID = /<?((?<user>@!?)|(?<role>@&)|(?<channel>#))?(\d{15,21})>?/g;
// const ID = /<?((?<user>@!?)|(?<role>@&)|(?<channel>#))?(\d{15,21})>?/g;
const USERNAME = /.*#[0-9]{4}/g;

module.exports = {
  parseDate: (date) =>
    date.toLocaleString('utc', {
      hour: 'numeric',
      minute: 'numeric',
      weekday: 'long',
      day: 'numeric',
      year: 'numeric',
      month: 'long'
    }),
  parseTime: (time) => {
    const methods = [
      { name: 'd', count: 86400 },
      { name: 'h', count: 3600 },
      { name: 'm', count: 60 },
      { name: 's', count: 1 }
    ];

    const timeStr = [
      Math.floor(time / methods[0].count).toString() + methods[0].name
    ];
    for (let i = 0; i < 3; i++) {
      timeStr.push(
        Math.floor(
          (time % methods[i].count) / methods[i + 1].count
        ).toString() + methods[i + 1].name
      );
    }
    return timeStr.filter((t) => !t.startsWith('0')).join(' ');
  },

  // add a global param so that users from any server can be found for devs only
  parseMember: (user, guild) => {
    const idMatch = ID.exec(user);
    const usernameMatch = USERNAME.exec(user);
    USERNAME.lastIndex = 0;
    ID.lastIndex = 0;
    if (idMatch) {
      user = idMatch.groups.user
        ? user.replace(/<@!?/g, '').replace(/>/g, '')
        : user;
      const possibleUser = guild.members.cache.find((m) => m.user.id === user);
      return possibleUser;
    }
    if (usernameMatch) {
      // lazy parsing goes here
      const possibleUser = guild.members.cache.find((m) => m.user.tag === user);
      return possibleUser;
    }
    // lazy parsing goes here as well
    const possibleUser = guild.members.cache.find((m) => m.nickname === user);
    return possibleUser;
  },
  parseRole: (role, guild) => {
    const idMatch = ID.exec(role);
    ID.lastIndex = 0;
    if (idMatch) {
      role = idMatch.groups.role
        ? role.replace(/<@&/g, '').replace(/>/g, '')
        : role;
      return guild.roles.resolve(role);
    }
    return guild.roles.cache.find((r) => r.name === role);
  },
  parseChannel: (channel, guild) => {
    const idMatch = ID.exec(channel);
    ID.lastIndex = 0;
    if (idMatch) {
      channel = idMatch.groups.channel
        ? channel.replace(/<#/g, '').replace(/>/g, '')
        : channel;
      return guild.channels.resolve(channel);
    }
    return guild.channels.cache.find((c) => c.name === channel);
  },
  parseQuotes: (args) => {
    const copyArgs = [...args];
    let searching = null;
    let target = null;
    for (const arg of copyArgs) {
      if (searching) {
        copyArgs[target] += ` ${arg}`;
        copyArgs[copyArgs.indexOf(arg)] = '';
        if (arg.endsWith(searching)) {
          copyArgs[target] = copyArgs[target].slice(1, -1);
          searching = null;
          target = null;
        }
      } else if (arg.startsWith("'")) {
        searching = "'";
        target = copyArgs.indexOf(arg);
      }
    }
    return copyArgs.filter((arg) => arg && arg);
  }
};
