/* eslint-disable no-eval */
/* eslint-disable no-unused-vars */
const { inspect } = require('util');
const OwnerCommand = require('../../models/Command/OwnerCommand');

module.exports = new OwnerCommand(
  async ({ ctx, msg, args }) => {
    let input = args.join(' ');
    if (input.match(/^```(js)?(.|\n)*```$/g)) {
      input = input.replace(/^```(js)?\n/g, '').replace(/```$/g, '');
    }
    const asynchr = input.match(/(return|await)/g);

    let result;
    try {
      result = await eval(asynchr ? `(async () => ${input})()` : input);
      if (typeof result !== 'string') {
        result = inspect(result, {
          depth: 1
        });
      }
    } catch (e) {
      result = e.stack;
    }

    const tokenRegex = new RegExp(ctx.token, 'gi');
    result = result.replace(tokenRegex, 'no');
    if (result.length > 1500) {
      if (result.length >= 1901) {
        result = await OwnerCommand.uploadResult(result, {
          input
        });
        return `Oh no! looks like the result for this is too big:\n${result}`;
      }
      result = `${result.slice(0, 1500)}...`;
    }

    return ctx.utils.codeblock(result, 'js');
  },
  {
    name: 'eval',
    aliases: ['e'],
    usage: "pretty simple c'mon now, <command>",
    argReq: true,
    minArgs: 1,
    responses: {
      noArg: 'give me something to evaluate smh'
    }
  }
);
