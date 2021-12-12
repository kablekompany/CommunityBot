/* eslint-disable no-await-in-loop */
/* eslint-disable no-case-declarations */
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { selfRoles, colourRoles } = require('../../assets/communityRoles');

const selfRolesChannel = '882509580024840192';
const submissions = '919635043201204314';
/**
 * @param {import('discord.js').MessageComponentInteraction} interaction interaction received by the gateway
 */
module.exports = async function oninteraction(interaction) {
  const reply = (stuff) =>
    interaction.reply(stuff).catch((e) => console.error(e.message));

  if (interaction.isButton() && interaction.customId.startsWith('approve')) {
    const submission = {
      link: interaction.message.embeds[0].image.url,
      userID: interaction.message.embeds[0].footer.text,
    };

    const emb = interaction.message.embeds[0];
    emb.color = 8519546; // green
    await interaction.message.edit({
      content: `Approved by **${interaction.user.tag}**`,
      embeds: [emb],
      components: [],
    });
    const submissionChannel = this.bot.channels.resolve(submissions);
    const submissionID = await this.db.submissions.addSubmission(
      submission.userID,
      submission.link,
    );

    const components = [
      new MessageActionRow({
        components: [
          new MessageButton({
            emoji: {
              id: '919609115129569350',
              name: 'upvote',
            },
            style: 'SUCCESS',
            customId: `upvotes_${submission.userID}_${submissionID}`,
          }),
          new MessageButton({
            emoji: {
              id: '919609066442063952',
              name: 'downvote',
            },
            style: 'DANGER',
            customId: `downvotes_${submission.userID}_${submissionID}`,
          }),
        ],
      }),
    ];
    const embed = new MessageEmbed()
      .setTitle(`Art Submission #${submissionID}`)
      .setColor('0x2f3136')
      .setImage(submission.link);
    await submissionChannel.send({
      embeds: [embed],
      components,
    });
    return reply({
      embeds: [
        {
          description: `**Submission #${submissionID}** has been posted! See <#${submissions}> for the message.`,
          color: 8519546, // green
        },
      ],
      ephemeral: true,
    });
  }

  if (interaction.isButton() && interaction.customId.includes('deny')) {
    const emb = interaction.message.embeds[0];
    emb.color = 16711680; // red
    await interaction.message.edit({
      content: `Denied by **${interaction.user.tag}**`,
      embeds: [emb],
      components: [],
    });
    return reply({
      embeds: [
        {
          description: 'Submission denied',
        },
      ],
      ephemeral: true,
    });
  }

  if (
    interaction.isButton() &&
    ['upvotes', 'downvotes'].some((a) => interaction.customId.startsWith(a))
  ) {
    // eslint-disable-next-line no-unused-vars
    const [type, userID, submissionID] = interaction.customId.split('_');
    const hasVoted = await this.db.submissions.hasVoted(
      interaction.user.id,
      submissionID,
    );

    if (hasVoted === true) {
      return reply({
        embeds: [
          {
            title: 'You can only vote once per submission',
            description: `You've already voted for **submission #${submissionID}** ${interaction.user.username}.`,
            color: 16711680, // red
          },
        ],
        ephemeral: true,
      });
    }

    if (type === 'upvotes') {
      await this.db.submissions.addVote(
        submissionID,
        interaction.user.id,
        'upvotes',
      );
    } else if (type === 'downvotes') {
      await this.db.submissions.addVote(
        submissionID,
        interaction.user.id,
        'downvotes',
      );
    }
    return reply({
      embeds: [
        {
          description: `You've successfully voted for **submission #${submissionID}** ${interaction.user.username}.`,
          color: 8519546, // green
        },
      ],
      ephemeral: true,
    });
  }

  if (interaction.channelId === selfRolesChannel) {
    const role = interaction.guild.roles.cache.get(
      selfRoles[interaction.customId],
    );

    await interaction.guild.members.fetch(interaction.member.id);
    if (!role) {
      return reply({
        content: 'uh this is awkward, go yell at daunt',
        ephemeral: true,
      });
    }

    try {
      if (interaction.member._roles.includes(role.id)) {
        await interaction.member.roles.remove(role.id);
        await reply({
          embeds: [
            {
              title: `Removed ${role.name} from you`,
              color: role.color || 8907491,
            },
          ],
          ephemeral: true,
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
                      value: role.name,
                    },
                    {
                      name: 'Removed Role(s)',
                      value: roleNames.map((r) => r).join('\n'),
                    },
                  ],
                  color: role.color,
                },
              ],
              ephemeral: true,
            });
          }
        }

        // End of the checking module.
        await interaction.member.roles.add(role.id);
        await reply({
          embeds: [
            {
              title: `Added ${role.name} to you`,
              color: role.color || 8907491,
            },
          ],
          ephemeral: true,
        });
      }
    } catch (err) {
      await reply({
        content: 'Something went wrong here, go yell at daunt for this error.',
        ephemeral: true,
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
