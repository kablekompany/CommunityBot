const Command = require('./CommandModel');

class OwnerCommand extends Command {
  constructor(func, props) {
    super(func, props);
    this._props = props;
  }

  async execute({ ctx, msg, args, cleanArgs }) {
    if (!ctx.config.owners.includes(msg.author.id)) {
      return null;
    }
    try {
      return super.execute({ ctx, msg, args, cleanArgs });
    } catch (err) {
      console.error(err.stack);
    }
  }

  get props() {
    return Object.assign(
      super.props,
      {
        ownerOnly: true,
      },
      this._props,
    );
  }
}

module.exports = OwnerCommand;
