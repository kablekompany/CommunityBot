/* eslint-disable no-await-in-loop */
/* eslint-disable no-case-declarations */
const { selfRoles, colourRoles } = require('../../assets/communityRoles');

const buttonChannel = '882509580024840192';
/**
 * @param {import('discord.js').Interaction} interaction interaction received by the API
 * @returns {null}
 */
module.exports = async function oninteraction(interaction) {
  if (interaction.channelId === buttonChannel) {
    const role = interaction.guild.roles.cache.get(
      selfRoles[interaction.customId],
    );

    const reply = (stuff) =>
      interaction.reply(stuff).catch((e) => console.error(e.message));

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
      .execute(interaction);
  } catch (error) {
    console.error(`[Application Command Interaction] ${error.stack}`);
  }
  return null;
};
