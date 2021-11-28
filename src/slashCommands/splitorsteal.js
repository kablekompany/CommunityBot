const { Collection, MessageButton, MessageActionRow } = require('discord.js');
const CommandOptionType = require('../utils/CommandOptionType');
const {
  removeDuplicates,
  relativeTime,
  randomInArray,
  sleep,
} = require('../utils/misc');
const { dmc } = require('../configs/config.json');

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
      users = removeDuplicates(collected.map((c) => c));
      await message.edit({
        content: `**Event ended** ${relativeTime()} and **\`${
          users.length === 1 ? 'one person' : `${users.length} people`
        }\`** joined!`,
        components: [
          new MessageActionRow().addComponents(joinButton.setDisabled(true)),
        ],
      });
      if (users.length <= 1) {
        return interaction.followUp('Not enough people joined :(');
      }
      return null;
    });

    await sleep(time);
    const winner1 = randomInArray(users);
    const winner2 = randomInArray(
      users.filter((u) => u.user.id !== winner1.user.id),
    );

    if (!winner1 || !winner2) {
      return null;
    }

    // add event participant role to both users for 2 minutes
    await Promise.all(
      [winner1, winner2].map(async ({ member }) => {
        await member.roles.add(dmc.eventParticipant);
        return setTimeout(
          () => member.roles.remove(dmc.eventParticipant),
          time * 3,
        );
      }),
    );

    const winners = [winner1.user.id, winner2.user.id];
    const winnerMentions = `${winners
      .map((userID) => `<@${userID}>`)
      .join(' & ')}`;
    const choices = new Collection();
    const splitButton = new MessageButton()
      .setStyle('PRIMARY')
      .setCustomId('split')
      .setLabel('Split')
      .setEmoji('💸');
    const stealButton = new MessageButton()
      .setStyle('PRIMARY')
      .setCustomId('steal')
      .setLabel('Steal')
      .setEmoji('a:pepeRobber:894458233769558096');

    await interaction.followUp({
      content: `${winnerMentions} are the contestants!`,
      embeds: [
        {
          title: `${prize} is on the line!`,
          description: `Both of you have **1 minute and 30 seconds to discuss**, and then **30 seconds to choose** either **SPLIT** or **STEAL**! Remember, if both users choose steal then it has to be re-done!\n\nA message with 2 buttons (split/steal) will be posted <t:${Math.round(
            Date.now() / 1000 + 90,
          )}:R> for both contestants to choose!`,
          footer: {
            icon_url: interaction.guild.iconURL({ dynamic: true }),
            text: 'Results will be posted after both users have discussed and made a choice.',
          },
        },
      ],
    });

    // wait 90s then enable buttons for players to make a choice
    await sleep(time * 3);
    const prompt = await interaction.channel.send({
      content: `It's time for ${winnerMentions} to make a choice!`,
      components: [
        new MessageActionRow().addComponents(splitButton, stealButton),
      ],
    });
    const choiceCollector = await prompt.createMessageComponentCollector({
      componentType: 'BUTTON',
      time,
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
        await click.reply({
          content: `You've chosen to **SPLIT** 💸 ${click.user.username}!`,
          ephemeral: true,
        });
      }

      if (click.customId === 'steal') {
        choices.set(click.user.username, 'steal');
        await reply();
        await click.reply({
          content: `You've chosen to **STEAL** <a:pepeRobber:894458233769558096> ${click.user.username}!`,
          ephemeral: true,
        });
      }

      if (choices.size === 2) {
        choiceCollector.stop('choices set');
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
      const getChoice = (winner) =>
        `<@${winner.user.id}> has chosen to **${choices
          .get(winner.user.username)
          .toUpperCase()}**`;
      return interaction.followUp({
        content: `${getChoice(winner1)}\n${getChoice(winner2)}`,
      });
    });
    return null;
  },
  name: 'splitorsteal',
  description:
    'Start a split or steal event, contestants have 1 minute 30s to discuss and then 30s to choose!',
  options: [
    {
      name: 'prize',
      type: CommandOptionType.String,
      description: "The prize that's going to be up for grabs",
      required: true,
    },
  ],
  default_permission: false,
};
