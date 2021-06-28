const fetch = require('node-fetch');

class Command {
  constructor(func, props) {
    this.run = func;
    this._props = props;
  }

  static resolveUser(ctx, user) {
    let possibleUser;
    const users = ctx.bot.users.cache;
    const result =
      user.match(/<?(@!?)?(\d{15,21})>?/g) || user.match(/.+#\d{4}/g);
    if (user.match(/<?(@!?)?(\d{15,21})>?/g)) {
      user = result.shift();
      user = user.replace(/<@!?/g, '').replace(/>/g, '');
      possibleUser = users.get(user);
    }
    if (user.match(/.+#\d{4}/g)) {
      user = result.shift();
      possibleUser = users.find((u) => u.tag === user);
    }
    return possibleUser;
  }

  static resolveMember(msg, member) {
    let possibleMember;
    const members = msg.guild.members.cache;

    const result =
      member.match(/<?(@!?)?(\d{15,21})>?/g) || member.match(/.+#\d{4}/g);
    if (member.match(/<?(@!?)?(\d{15,21})>?/g)) {
      member = result.shift();
      member = member.replace(/<@!?/g, '').replace('>', '');
      possibleMember = members.get(member);
    }

    if (member.match(/.+#\d{4}/g)) {
      member = result.shift();
      possibleMember = members.find((m) => m.user.tag === member);
    } else {
      possibleMember = members.find((m) => m.nickname === member);
    }

    return possibleMember;
  }

  static resolveChannel(msg, channel) {
    let possibleChannel;
    const channels = msg.guild.channels.cache;

    const result = channel.match(/<?(@!?)?(\d{15,21})>?/g);
    if (channel.match(/(<#)?\d{15,21}>?/g)) {
      channel = result.shift();
      channel = channel.replace('<#', '').replace('>', '');
      possibleChannel = channels.get(channel);
    } else {
      possibleChannel = channels.find((c) => c.name === channel);
    }
    return possibleChannel;
  }

  static resolveRole(msg, role) {
    let possibleRole;
    const roles = msg.guild.roles.cache;

    const result = role.match(/<?(@!?)?(\d{15,21})>?/g);
    if (role.match(/(<@&)?\d{15,21}>?/g)) {
      role = result.shift();
      role = role.replace(/<@&/g, '').replace(/>/g, '');
      possibleRole = roles.get(role);
    } else {
      possibleRole = roles.find((r) => r.name === role);
    }
    return possibleRole;
  }

  static async uploadResult(
    content,
    opts = {
      ext: 'javascript',
      input: '',
    },
  ) {
    const body =
      'raw=false&' +
      `ext=${opts.ext || 'javascript'}&` +
      `text=${encodeURIComponent(
        (opts.input ? `${opts.input}\n\n` : '') + content,
      )}`;

    const res = await fetch('https://hastepaste.com/api/create', {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return res.text();
  }

  async execute({ ctx, msg, args, cleanArgs }) {
    if (this.props.development) {
      return null;
    }

    if (this.props.argReq) {
      if (args.length === 0) {
        return this.props.responses.noArg;
      }

      if (args.length < this.props.minArgs) {
        return this.props.responses.lowArg;
      }
    }
    let res;
    try {
      res = await this.run({
        ctx,
        msg,
        args,
        cleanArgs,
      });
      return res;
    } catch (err) {
      res = err.message;
      return `An error occured :(\n\`${res}\``;
    }
  }

  get props() {
    return {
      name: '',
      aliases: [],
      usage: '<command>',
      ownerOnly: false,
      argReq: false,
      minArgs: 0,
      responses: {
        noArg: 'You need to put in some args!',
        lowArg: 'Not enough args!',
      },
      argType: [],
      development: false,
      ...this._props,
    };
  }

  get triggers() {
    return [this.props.name, ...this.props.aliases];
  }
}

module.exports = Command;
