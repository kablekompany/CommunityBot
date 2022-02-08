const { exec } = require('child_process');
const OwnerCommand = require('../../models/Command/OwnerCommand');

module.exports = new OwnerCommand(
	async ({ ctx, msg, args }) => {
		const toExec = args.join(' ');
		const hrStart = process.hrtime();
		const hrDiff = process.hrtime(hrStart);

		exec(toExec, async (e, stdout, stderr) => {
			if (stdout.length + stderr.length > 1990) {
				const haste = await OwnerCommand.uploadResult(
					`${stdout}\n\n${stderr}`,
					{
						input: toExec
					}
				);
				return msg.channel.send({
					embeds: [
						{
							title: 'Result too long!',
							description: `Exceeds 2,000 characters.\n**[View Here](${haste})**`,
							footer: {
								text: `Executed in ${
									hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ''
								}${hrDiff[1] / 10000}ms`
							}
						}
					]
				});
			}
			if (stdout) {
				msg.channel.send(
					`**📤 Output**:\n${ctx.utils.codeblock(stdout, 'bash')}`
				);
			}
			if (stderr) {
				msg.channel.send(
					`**❌ Error**:\n${ctx.utils.codeblock(stderr, 'bash')}`
				);
			}
			if (e) {
				msg.channel.send(e);
			}
			if (!stderr && !stdout) {
				msg.react('❌');
			}
			return null;
		});
		return null;
	},
	{
		name: 'exec',
		aliases: ['ex'],
		usage: "pretty simple c'mon now, <command>",
		argReq: true,
		minArgs: 1,
		responses: {
			noArg: 'give me something to execute smh'
		}
	}
);
