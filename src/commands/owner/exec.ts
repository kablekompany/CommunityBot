import { type Args, Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { type Message } from 'discord.js';

import { Formatters, MessageEmbed } from 'discord.js';
import { isNullOrUndefined } from '@sapphire/utilities';
import { exec } from 'node:child_process';
import node from 'node-fetch';

@ApplyOptions<Command.Options>({
  aliases: ['exec'],
  preconditions: ['OwnerOnly'],
})
export default class extends Command {
  public async messageRun(msg: Message, args: Args) {
    const cmd = await args.restResult('string');
    if (cmd.error) return msg.reply('U gotta type something to execute smh');

    const hrStart = process.hrtime();
    const hrDiff = process.hrtime(hrStart);

    exec(cmd.value, async (err, stdout, stderr) => {
      if (stdout.length + stderr.length > 1990) {
        const haste = await this.uploadResult(`${stdout}\n\n${stderr}`, { 
          ext: 'javascript', 
          input: cmd.value 
        });

        return msg.channel.send({
          embeds: [
            {
              title: 'Result Char > 2000',
              description: `
                Exceeded 2,000 characters.
                ${Formatters.hyperlink('View Here', new URL(haste))}
              `,
              footer: {
                text: `Executed in ${hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ''}${
                  hrDiff[1] / 10000
                }ms`
              }
            }
          ]
        })
      }

      const embed = new MessageEmbed();

      if (stdout) {
        embed.addField('📤 Output', Formatters.codeBlock('bash', stdout));
      }
      if (stderr) {
        embed.addField('❌ Error', Formatters.codeBlock('bash', stderr));
      }
      if (err) {
        await msg.channel.send({
          embeds: [
            {
              title: 'Exec Exception',
              description: `
                ${Formatters.bold('Code')}: ${err.code}
                ${Formatters.bold('Message')} ${err.message}
              `
            }
          ]
        });
      }
      if ([stderr, stdout].map(isNullOrUndefined).every(v => v === true)) {
        await msg.react('❌');
      }
      if (embed.fields.length < 1) {
        embed.setDescription('Neither a result nor an error exists.');
      }
      return msg.channel.send({ embeds: [embed] });
    });
  }

  private async uploadResult(content: string, opts = { ext: 'javascript', input: '' }) {
    const body = new URLSearchParams({
      raw: 'false',
      ext: opts.ext ?? 'javascript',
      text: encodeURIComponent(
        (opts.input ? `${opts.input}\n\n` : '') + content,
      )
    });

    const res = await node('https://hastepaste.com/api/create', {
      method: 'POST',
      body: body,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    return res.text();
  }
}
