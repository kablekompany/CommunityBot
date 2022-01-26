const {
  MessageButton: Button,
  MessageActionRow: ActionRow,
  MessageEmbed: Embed,
  MessageButton
} = require('discord.js');
const { pickBy } = require('lodash');
const CommandOptionType = require('../utils/CommandOptionType');

module.exports = {
  /**
   * @param {import('discord.js').CommandInteraction} interaction interaction received by the API
   * @param {import('../models/Bot/BotModel')} ctx
   */
  async execute(interaction, ctx) {
    await interaction.deferReply({ ephemeral: true });
    const question = interaction.options.getString('question');
    const randomVoter = interaction.options.getBoolean('random_voter') ?? false;
    const options = this.options
      .filter((o) => o.name !== 'random_voter')
      .map((o) => interaction.options.getString(o.name) ?? null)
      .filter((o, index) => index !== 0 && o !== null);
    const defaultChoices = {
      one: {
        choice: '',
        votes: 0
      },
      two: {
        choice: '',
        votes: 0
      },
      three: {
        choice: '',
        votes: 0
      },
      four: {
        choice: '',
        votes: 0
      },
      five: {
        choice: '',
        votes: 0
      }
    };
    const numbers = {
      1: 'one',
      2: 'two',
      3: 'three',
      4: 'four',
      5: 'five'
    };
    options.forEach((value, idx) => {
      defaultChoices[numbers[idx + 1]].choice = value === null ? '' : value;
    });

    const choices = pickBy(defaultChoices, (a) => a.choice !== '');
    const emotes = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'].slice(
      0,
      Object.keys(choices).length
    );

    const yes = new MessageButton({
      label: 'Yes',
      style: 'SUCCESS',
      customId: `yes_${interaction.user.id}`
    });
    const no = new MessageButton({
      label: 'No',
      style: 'DANGER',
      customId: `no_${interaction.user.id}`
    });
    const prompt = await interaction.editReply({
      content: `Are you sure you want to post this to <#${ctx.config.dmc.votes}>?`,
      components: [new ActionRow({ components: [yes, no] })]
    });
    const collector = prompt.createMessageComponentCollector({
      componentType: 'BUTTON',
      time: 15_000
    });

    collector.on('collect', async (button) => {
      collector.stop();
      if (button.customId === `no_${interaction.user.id}`) {
        return button.reply({
          content: 'Okay, not gonna post this poll then.',
          ephemeral: true
        });
      }
      await button.deferReply({ ephemeral: true });
      const pollNumber = await ctx.db.polls.addPoll(
        interaction.user.id,
        question,
        choices,
        randomVoter,
        Date.now()
      );

      const buttons = emotes.map(
        (e, idx) =>
          new Button({
            customId: `poll_${pollNumber}_choice_${numbers[idx + 1]}`,
            style: 'SECONDARY',
            emoji: e
          })
      );
      const endButton = new Button({
        customId: `endPoll_${pollNumber}`,
        label: 'End Poll',
        style: 'DANGER'
      });

      const components = [
        new ActionRow({ components: [...buttons] }),
        new ActionRow({ components: [endButton] })
      ];
      const voteChannel = ctx.bot.channels.resolve(ctx.config.dmc.votes);
      const embed = new Embed({
        title: `Poll #${pollNumber} by ${interaction.user.username}`,
        color: 0x3b88c3,
        fields: [
          { name: 'Question', value: question },
          {
            name: 'Choices',
            value: options
              .map((option, idx) => `${emotes[idx]} — ${option}`)
              .join('\n\n')
          }
        ],
        timestamp: new Date()
      });
      voteChannel.send({
        embeds: [embed],
        components
      });
      return button.editReply({
        content: `Successfully created poll **#${pollNumber}**, view it in ${voteChannel.toString()}!`
      });
    });
  },
  name: 'poll',
  description: 'Start a poll for the #votes channel!',
  default_permission: false,
  options: [
    {
      name: 'question',
      type: CommandOptionType.String,
      description: 'What this poll is about',
      required: true
    },
    {
      name: 'choice_1',
      type: CommandOptionType.String,
      description: 'The first choice for this poll.',
      required: true
    },
    {
      name: 'choice_2',
      type: CommandOptionType.String,
      description: 'The second choice for this poll',
      required: true
    },
    {
      name: 'choice_3',
      type: CommandOptionType.String,
      description: 'The third choice for this poll.',
      required: false
    },
    {
      name: 'choice_4',
      type: CommandOptionType.String,
      description: 'The fourth choice for this poll',
      required: false
    },
    {
      name: 'choice_5',
      type: CommandOptionType.String,
      description: 'The fifth choice for this poll.',
      required: false
    },
    {
      name: 'random_voter',
      type: CommandOptionType.Boolean,
      description: 'Select "true" if you\'d like a random voter to be chosen',
      required: false
    }
  ]
};
