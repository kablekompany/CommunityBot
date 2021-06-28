module.exports = {
  checkUserPerms: (member, channel, permissions) =>
    member.permissionsIn(channel).has(permissions),

  checkHierarchy: (cmdUser, targetMember) =>
    cmdUser.roles.highest.position > targetMember.roles.highest.position,

  checkGuildOwner: (msg) => msg.author.id === msg.guild.ownerID,

  checkBotOwner: (config, msg) => config.owners.includes(msg.author.id),

  checkPerms(member, config, msg, cmd) {
    if (this.checkBotOwner(config, msg)) {
      return true;
    }
    if (cmd.category === 'owner') {
      return false;
    }
    if (cmd.permissions) {
      if (this.checkGuildOwner(msg)) {
        return true;
      }
      if (this.checkUserPerms(msg.member, msg.channel, cmd.permissions)) {
        // you might need to change this
        if (this.checkUserPerms(member, msg.channel, cmd.permissions)) {
          return true;
        }
      }
    } else {
      return true;
    }
    return false;
  },
};
