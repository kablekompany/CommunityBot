/* eslint-disable no-await-in-loop */
const QuickChart = require('quickchart-js');
const {
  selfRoles,
  colourRoles,
  selfRolesChannel
} = require('../../assets/communityRoles');
/**
 * @param {import('discord.js').MessageComponentInteraction} interaction interaction received by the gateway
 */
module.exports = async function oninteraction(interaction) {
  const reply = (stuff) =>
    interaction.reply(stuff).catch((e) => console.error(e.message));

  if (interaction.isButton() && interaction.customId.startsWith('poll')) {
    // eslint-disable-next-line no-unused-vars
    const [_, pollID, __, choice] = interaction.customId.split('_');
    const {
      user: { id, username }
    } = interaction;
    const hasVoted = await this.db.polls.hasVoted(pollID, id);
    if (hasVoted === true) {
      return reply({
        embeds: [
          {
            title: 'You can only vote once',
            description: `You've already voted for **poll #${pollID}** ${username}`,
            color: 16711680 // red
          }
        ],
        ephemeral: true
      });
    }

    await this.db.polls.addVote(pollID, id, choice);
    return reply({
      embeds: [
        {
          description: `You've successfully voted for **poll #${pollID}** ${username}`,
          color: 8519546 // green
        }
      ],
      ephemeral: true
    });
  }

  if (interaction.isButton() && interaction.customId.startsWith('endPoll')) {
    const pollID = interaction.customId.split('_')[1];
    const poll = await this.db.polls.get(+pollID);
    const emotes = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'];
    if (poll.createdBy !== interaction.user.id) {
      return reply({
        embeds: [{ description: "This isn't your poll, so you can't end it." }],
        ephemeral: true
      });
    }
    await this.db.polls.end(poll._id);
    const choices = Object.values(poll.choices);
    const choicesObject = {};

    choices.forEach((c, idx) => {
      choicesObject[idx + 1] = c.votes;
    });
    const myChart = new QuickChart()
      .setWidth(640)
      .setHeight(480)
      .setBackgroundColor('#0D0C1D');
    const [choiceNumber, voteCount] = Object.entries(choicesObject)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .reduce(
        (acc, elem) => {
          acc[0].push(elem[0]);
          acc[1].push(elem[1]);
          return acc;
        },
        [[], []]
      );
    myChart.setConfig({
      type: 'outlabeledPie',
      data: {
        labels: choiceNumber,
        datasets: [
          {
            backgroundColor: [
              '#e27d60',
              '#085dcb',
              '#e8a87c',
              '#c38d9e',
              '#41b3a3',
              '#8d8741',
              '#659dbd',
              '#daad86',
              '#bc986a',
              '#fbeec1'
            ],
            data: voteCount,
            borderColor: '#00000000'
          }
        ]
      },
      options: {
        title: {
          display: true,
          text: 'Vote Results'
        },
        legend: {
          position: 'right'
        },
        plugins: {
          outlabels: {
            text: '%l %p',
            color: 'black',
            stretch: 30,
            font: {
              minSize: 13
            }
          }
        }
      }
    });
    await interaction.message.edit({
      content: `This poll ended **${this.utils.formatTime()}**!`,
      components: [],
      embeds: [
        {
          title: `Results for poll #${pollID} by ${interaction.user.username}`,
          description: `Question: ${poll.question}\n\n${choices
            .map(
              (c, idx) =>
                `${emotes[idx]} — ${c.choice}: **${
                  c.votes?.toLocaleString() ?? 0
                }**`
            )
            .join('\n\n')}`,
          image: {
            url: myChart.getUrl()
          }
        }
      ]
    });
    return reply({
      content: `Successfully ended poll **#${pollID}**`,
      ephemeral: true
    });
  }

  if (interaction.channelId === selfRolesChannel && interaction.isButton()) {
    const role = interaction.guild.roles.cache.get(
      selfRoles[interaction.customId]
    );

    await interaction.guild.members.fetch(interaction.member.id);
    if (!role) {
      return reply({
        content: 'uh this is awkward, go yell at daunt',
        ephemeral: true
      });
    }

    try {
      if (interaction.member._roles.includes(role.id)) {
        await interaction.member.roles.remove(role.id);
        await reply({
          embeds: [
            {
              title: `Removed ${role.name} from you`,
              color: role.color || 8907491
            }
          ],
          ephemeral: true
        });
      } else {
        // The start of the check module.
        for (const colour of colourRoles) {
          if (
            colourRoles.includes(role.id) &&
            interaction.member._roles.includes(colour)
          ) {
            const toRemove = [];
            interaction.member._roles.forEach((r) => {
              if (colourRoles.includes(r)) {
                toRemove.push(r);
              }
            });
            await interaction.member.roles.remove(toRemove);
            const roleNames = toRemove
              .map((r) => interaction.guild.roles.cache.get(r).name)
              .filter((r) => role.name !== r);
            await interaction.member.roles.add(role.id);
            return reply({
              embeds: [
                {
                  title: 'Updated Roles',
                  fields: [
                    {
                      name: 'Added Role',
                      value: role.name
                    },
                    {
                      name: 'Removed Role(s)',
                      value: roleNames.map((r) => r).join('\n')
                    }
                  ],
                  color: role.color
                }
              ],
              ephemeral: true
            });
          }
        }

        // End of the checking module.
        await interaction.member.roles.add(role.id);
        await reply({
          embeds: [
            {
              title: `Added ${role.name} to you`,
              color: role.color || 8907491
            }
          ],
          ephemeral: true
        });
      }
    } catch (err) {
      await reply({
        content: 'Something went wrong here, go yell at daunt for this error.',
        ephemeral: true
      });
      console.error(err.message);
    }
  }

  // Slash commands
  try {
    if (!interaction.client.slashCmds.has(interaction.commandName)) {
      return null;
    }
    await interaction.client.slashCmds
      .get(interaction.commandName)
      .execute(interaction, this);
  } catch (error) {
    console.error(`[Application Command Interaction] ${error.stack}`);
  }
  return null;
};
