const { MessageButton, MessageActionRow } = require('discord.js');
const CommandOptionType = require('../utils/CommandOptionType');

const imageURLRegex =
  /(?:([^:/?#]+):)?(?:\/\/([^/?#]*))?([^?#]*\.(?:jpg|jpeg|png))(?:\?([^#]*))?(?:#(.*))?/g;
const submissionChannel = '914382828186255391';
const submissions = '919635043201204314';

module.exports = {
  /**
   * @param {import('discord.js').CommandInteraction} interaction interaction received by the API
   * @param {import('../models/Bot/BotModel')} ctx
   */
  async execute(interaction, ctx) {
    const link = interaction.options.getString('link');

    const errorEmbed = {
      title: 'Invalid image URL',
      description:
        'Please ensure the link is a _direct_ link to the image. Direct links should end in **.png**, **.jpg** OR **.jpeg**.\n\nExample: https://i.imgur.com/wDPDj3T.png',
      color: 16711680, // red
    };

    if (!link.match(imageURLRegex)) {
      return interaction.reply({
        embeds: [errorEmbed],
        ephemeral: true,
      });
    }

    const alreadySubmitted = await ctx.db.submissions.exists(
      interaction.user.id,
    );

    if (alreadySubmitted) {
      return interaction
        .reply({
          embeds: [
            {
              title: "You've already submitted an art piece!",
              description:
                'You can only submit one art piece to be voted for. If you would like to re-submit your piece, please ping **Dauntless#0711**.',
              color: 16711680, // red
            },
          ],
          ephemeral: true,
        })
        .catch(console.error);
    }
    const usertag = interaction.user.tag;
    const components = [
      new MessageActionRow({
        components: [
          new MessageButton({
            emoji: {
              id: '919416789266497596',
              name: 'approve',
            },
            style: 'SECONDARY',
            customId: `approve_${usertag}`,
          }),
          new MessageButton({
            emoji: {
              id: '919416821428412517',
              name: 'deny',
            },
            style: 'SECONDARY',
            customId: `deny_${usertag}`,
          }),
        ],
      }),
    ];

    const channel = interaction.client.channels.resolve(submissionChannel);

    await channel.send({
      embeds: [
        {
          title: `Art Submission by ${usertag}`,
          image: {
            url: link,
          },
          footer: {
            text: interaction.user.id,
          },
          color: 0x2f3136, // grey
        },
      ],
      components,
    });

    return interaction
      .reply({
        embeds: [
          {
            title: 'Art has been submitted for review, sit tight!',
            description: `It will be posted in <#${submissions}> when an admin or moderator reviews it to ensure that it doesn't break any rules.`,
            color: 8519546, // green
          },
        ],
        ephemeral: true,
      })
      .catch(console.error);
  },
  name: 'submit',
  description: 'Submit Christmas themed art with a direct image link.',
  options: [
    {
      name: 'link',
      type: CommandOptionType.String,
      description: 'The direct image link of the art.',
      required: true,
    },
  ],
};
