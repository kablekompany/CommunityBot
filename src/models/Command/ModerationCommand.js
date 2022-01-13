const Command = require('./CommandModel');

class ModerationCommand extends Command {
  constructor(func, props) {
    super(func, props);
    this.func = func;
    this.props = props;
  }

  // static hierarchyCheck()

  async execute({ ctx, msg, args, cleanArgs }) {
    // do all the perm checks here
    super.execute({
      ctx,
      msg,
      args,
      cleanArgs
    });
  }

  get props() {
    return Object.apply(
      super.props,
      {
        permissions: [],
        hierarchy: false
      },
      this.props
    );
  }
}

module.exports = ModerationCommand;
