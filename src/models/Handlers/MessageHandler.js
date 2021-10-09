class MessageHandler {
  constructor(fn, props) {
    this.fn = fn;
    this._props = props;
  }

  static argify(msg, prefix, separator = / /g) {
    if (!msg.content.toLowerCase().startsWith(prefix.toLowerCase())) {
      return null;
    }
    return msg.content
      .slice(prefix.length)
      .split(separator)
      .filter((i) => !!i);
  }

  async execute({ ctx, msg }) {
    if (msg.channel.type === 'DM' && !this.props.allowDM) return null;
    if (msg.author.bot && !this.props.allowBot) return null;

    try {
      await this.fn({ ctx, msg });
    } catch (err) {
      console.error(err.stack);
    }
    return null;
  }

  get props() {
    return {
      name: '',
      allowDM: false,
      allowBot: false,
      ...this._props,
    };
  }
}

module.exports = MessageHandler;
