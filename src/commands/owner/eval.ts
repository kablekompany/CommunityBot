import { type Args, Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { type Message } from 'discord.js';
import { MessageEmbed, Formatters } from 'discord.js';
import { inspect } from 'util';
import { ok } from '@sapphire/framework';

const codeBlockRegex = /^```(js)?(.|\n)*```$/g;
const codeBlockHeadRegex = /^```(js)?\n/g;
const codeBlockTailRegex = /```$/g;
const { hyperlink, codeBlock } = Formatters;

@ApplyOptions<Command.Options>({
  aliases: ['eval', 'e'],
  preconditions: ['OwnerOnly'],
})
export default class extends Command {
  public async messageRun(msg: Message, args: Args) {
    let input = await args.restResult('string');
    if (input.error) return;

    if (input.value.match(codeBlockRegex)) {
      input = ok(
        input.value
          .replace(codeBlockHeadRegex, '')
          .replace(codeBlockTailRegex, ''),
      );
    }

    let result: string;
    try {
      result = await eval(input.value);
      if (typeof result !== 'string') {
        result = inspect(result, { depth: 1 });
      }
    } catch (e) {
      result = (e as Error).message;
    }

    const tokenRegex = new RegExp(msg.client.token!, 'gi');
    result = result.replace(tokenRegex, ':P');

    const embed = new MessageEmbed();
    const exceed = result.length >= 1901;

    if (exceed) {
      result = await this.container.util.haste(result);
      embed.setDescription(
        `Result exceeded 2000 chars. Click ${hyperlink(
          'this',
          result,
        )} for the full result.`,
      );
    } else {
      embed.addField('Input', codeBlock('js', input.value));
      embed.addField('Output', codeBlock('js', result));
    }

    return msg.channel.send({
      embeds: [embed.setColor(exceed ? 'RED' : 'DEFAULT')],
    });
  }
}
