const Command = require('../../models/Command/CommandModel');

module.exports = new Command(
  async ({ ctx, msg, args }) => {
    const caseNumber = +args[0];

    const postTemporaryMessage = async (content) => {
      const message = await msg.reply(content);
      setTimeout(async () => {
        await msg.delete();
        await message.delete();
      }, 4500);
    };

    if (Number.isNaN(+args[0])) {
      return postTemporaryMessage('The case number needs to be a.. _number_');
    }

    if (!args[1] || !args[1].length) {
      return postTemporaryMessage(
        'You need to provide a new reason for this case.'
      );
    }
    const newReason = args.slice(1).join(' ');
    const log = await ctx.db.logs.find({ case: caseNumber });

    if (!log.length) {
      return postTemporaryMessage(
        "That case couldn't be found, maybe you got the number wrong?"
      );
    }

    await ctx.db.logs.collection
      .findOneAndUpdate(
        { case: caseNumber },
        {
          $set: {
            reason: newReason
          }
        }
      )
      .then(() =>
        postTemporaryMessage(
          `Updated case **#${caseNumber}** with new reason: ${newReason}`
        )
      );
  },
  {
    name: 'reason',
    usage: 'reason <case #> <new reason>',
    aliases: ['reason'],
    modOnly: true,
    argReq: true,
    responses: {
      noArg: 'Syntax: `[p]reason <case #> <new reason>`'
    }
  }
);
