import { Command, CommandParams } from './BaseCommand';

export class OwnerCommand extends Command {
  public async execute(args: CommandParams) {
    if (!args.ctx.config.owners.includes(args.msg.author.id)) return;

    try {
      return await super.execute(args);
    } catch (e) {
      console.error(e.stack);
    }
  }
}
