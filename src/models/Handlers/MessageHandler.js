/** @typedef {Object} ExtendedMessage
 * @prop {import("discord.js").Message} msg
 */

class MessageHandler {
  constructor(fn, props) {
    this.fn = fn;
    this._props = props;
  }

  static argify(msg, prefix, separator = / /g) {
    if (
      msg.content.startsWith(prefix) ||
      msg.content.startsWith(prefix.toLowerCase())
    ) {
      return msg.content
        .slice(prefix.length)
        .split(separator)
        .filter((i) => !!i);
    }
    return null;
  }

  async execute({ ctx, msg }) {
    if (msg.channel.type === 'dm' && !this.props.allowDM) return null;
    if (msg.author.bot && !this.props.allowBot) return null;

    return this.fn({ ctx, msg });
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
