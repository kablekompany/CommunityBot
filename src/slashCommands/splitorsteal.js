const { Collection, MessageButton, MessageActionRow } = require('discord.js');
const CommandOptionType = require('../utils/CommandOptionType');
const {
  removeDuplicates,
  relativeTime,
  randomInArray,
  sleep,
} = require('../utils/misc');

const time = 30 * 1000;

module.exports = {
  /**
   * @param {import('discord.js').CommandInteraction} interaction interaction received by the API
   */
  async execute(interaction) {
    await interaction.deferReply();
    const prize = interaction.options.getString('prize', true);
    const joinButton = new MessageButton()
      .setCustomId('splitorsteal')
      .setStyle('SUCCESS')
      .setLabel('Join!');

    const message = await interaction.editReply({
      embeds: [
        {
          title: 'Split or Steal!',
          description:
            'Two winners will be selected, both of them will then choose `split` or `steal` by clicking the respective buttons. One of 3 things can occur:\n\n- if both contestants choose split, the prize will be divided amongst them equally\n- if only 1 contestant chooses steal, they will take the entirety of the prize\n- if both contestants choose steal, neither will receive anything and the giveaway will be re-done normally (i.e cancelled).',
          fields: [
            {
              name: 'Prize',
              value: prize,
              inline: true,
            },
          ],
          footer: {
            text: 'Ends in 30 seconds!',
          },
        },
      ],
      components: [new MessageActionRow().addComponents(joinButton)],
    });

    const collector = await message.createMessageComponentCollector({
      componentType: 'BUTTON',
      time,
    });

    const alreadyJoined = [];
    let users = [];

    collector.on('collect', async (click) => {
      if (!alreadyJoined.includes(click.user.id)) {
        alreadyJoined.push(click.user.id);
        await click.reply({
          content: 'Successfully joined, good luck!',
          ephemeral: true,
        });
        return null;
      }
      await click.reply({
        content: "You've already joined this split or steal session!",
        ephemeral: true,
      });
      return null;
    });

    collector.on('end', async (collected) => {
      users = removeDuplicates(collected.map((c) => c.user));
      if (users.length <= 1) {
        return interaction.followUp('Not enough people joined :(');
      }
      return message.edit({
        content: `**Event ended** ${relativeTime()} and **\`${
          users.length
        }\`** people joined!`,
        components: [
          new MessageActionRow().addComponents(joinButton.setDisabled(true)),
        ],
      });
    });

    await sleep(time);
    const winner1 = randomInArray(users);
    const winner2 = randomInArray(users.filter((u) => u !== winner1));
    const winners = [winner1.id, winner2.id];
    const choices = new Collection();
    const getChoice = (winner) =>
      `<@${winner.id}> has chosen to **${choices
        .get(winner.username)
        .toUpperCase()}**`;

    const splitButton = new MessageButton()
      .setStyle('SUCCESS')
      .setCustomId('split')
      .setLabel('Split')
      .setEmoji('💸');
    const stealButton = new MessageButton()
      .setStyle('DANGER')
      .setCustomId('steal')
      .setLabel('Steal')
      .setEmoji('a:pepeRobber:894458233769558096');

    const prompt = await interaction.channel.send({
      content: `${winners
        .map((userID) => `<@${userID}>`)
        .join(' & ')} are the contestants!`,
      embeds: [
        {
          title: `${prize} is on the line! Ends <t:${Math.round(
            Date.now() / 1000 + 120,
          )}:R>`,
          description:
            'Both of you have 2 minutes to choose, either **SPLIT** or **STEAL**! Remember, if both users choose steal then it has to be re-done!',
          footer: {
            icon_url: interaction.guild.iconURL({ dynamic: true }),
            text: 'Results will be posted after the 2 minutes has passed.',
          },
        },
      ],
      components: [
        new MessageActionRow().addComponents(splitButton, stealButton),
      ],
    });

    const choiceCollector = await prompt.createMessageComponentCollector({
      componentType: 'BUTTON',
      time: time * 4,
    });

    choiceCollector.on('collect', async (click) => {
      const reply = () =>
        interaction.followUp(`${click.user.username} has made a choice!`);

      if (!winners.includes(click.user.id)) {
        return click.reply({
          content: "You're not one of the winners, wyd?",
          ephemeral: true,
        });
      }

      if (choices.has(click.user.username)) {
        return click.reply({
          content: "You've already chosen!",
          ephemeral: true,
        });
      }

      if (click.customId === 'split') {
        choices.set(click.user.username, 'split');
        await reply();
        return click.reply({
          content: `You've chosen to **SPLIT** 💸 ${click.user.username}!`,
          ephemeral: true,
        });
      }

      if (click.customId === 'steal') {
        choices.set(click.user.username, 'steal');
        await reply();
        return click.reply({
          content: `You've chosen to **STEAL** <a:pepeRobber:894458233769558096> ${click.user.username}!`,
          ephemeral: true,
        });
      }
      return null;
    });

    choiceCollector.on('end', async () => {
      await prompt.edit({
        components: [
          new MessageActionRow().addComponents(
            splitButton.setDisabled(true),
            stealButton.setDisabled(true),
          ),
        ],
      });
      if (choices.size < 2) {
        return interaction.followUp(
          "One of the contestants didn't make a choice, time to re-do that I guess.",
        );
      }
      return interaction.followUp({
        content: `${getChoice(winner1)}\n${getChoice(winner2)}`,
      });
    });
    return null;
  },
  name: 'splitorsteal',
  description:
    'Start a split or steal giveaway event, join period is 30s and contestants have 2 minutes to choose!',
  options: [
    {
      name: 'prize',
      type: CommandOptionType.String,
      description: "The prize that's going to be up for grabs",
      required: true,
    },
  ],
};
