const CommandOptionType = require('../utils/CommandOptionType');

const domainRegex = /(?:[\w-]+\.)+[\w-]+/gi;

module.exports = {
  /**
   * @param {import('discord.js').CommandInteraction} interaction interaction received by the API
   * @param {import('../models/Bot/BotModel')} ctx
   */
  async execute(interaction, ctx) {
    const potentialLink = interaction.options.getString('link');
    await interaction.deferReply({ ephemeral: true });

    const domainRegexTest = domainRegex.exec(potentialLink.replace('www.', ''));

    if (!domainRegexTest) {
      return interaction.editReply("This doesn't seem like a valid URL/domain");
    }

    const basicCheck = await ctx.phisherman.checkDomain(domainRegexTest[0]);
    const advancedCheck = await ctx.phisherman.getDomainInfo(
      domainRegexTest[0]
    );

    let advancedCheckEmbed = {
      description: 'No extra info is available for this domain.'
    };

    if (
      advancedCheck &&
      !['safe', 'unknown'].includes(advancedCheck.classification)
    ) {
      advancedCheckEmbed = {
        title: `Domain Info | ${domainRegexTest[0]}`,
        description: `Caught \`${advancedCheck.phishCaught.toLocaleString()}\` times`,
        timestamp: new Date(),
        color:
          advancedCheck.classification === 'suspicious' ? 0xfbb948 : 0xf83656,
        fields: [
          {
            name: 'Status',
            value: advancedCheck.status,
            inline: true
          },
          {
            name: 'Verified Phish',
            value: advancedCheck.verifiedPhish ? 'Yes' : 'No',
            inline: true
          },
          {
            name: 'Classification',
            value: ctx.utils.capitalize(advancedCheck.classification),
            inline: true
          },
          {
            name: 'Date Added',
            value: ctx.utils.formatTime(advancedCheck.created, 'f'),
            inline: true
          },
          {
            name: 'First Seen',
            value: ctx.utils.formatTime(advancedCheck.firstSeen, 'f'),
            inline: true
          },
          {
            name: 'Last Seen',
            value: ctx.utils.formatTime(advancedCheck.lastSeen, 'f'),
            inline: true
          },
          {
            name: 'Targeted Brand',
            value: advancedCheck.targetedBrand,
            inline: true
          }
        ]
      };
    }

    return interaction.editReply({
      embeds: [
        {
          title: 'Basic Check Results',
          description: `Classification: ${
            basicCheck.classification
          }\nVerified phishing link: ${
            basicCheck.verifiedPhish === true ? 'Yes' : 'No'
          }`
        },
        advancedCheckEmbed
      ]
    });
  },
  name: 'checkdomain',
  description: 'Check a link against the phisherman.gg API for phishing links.',
  default_permission: false,
  options: [
    {
      name: 'link',
      type: CommandOptionType.String,
      description: "The link you'd like to check",
      required: true
    }
  ]
};
