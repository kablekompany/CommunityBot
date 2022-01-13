const {
  MessageActionRow,
  MessageButton,
  MessageEmbed: Embed,
} = require('discord.js');

function arrayMoveMutable(array, fromIndex, toIndex) {
  const startIndex = fromIndex < 0 ? array.length + fromIndex : fromIndex;

  if (startIndex >= 0 && startIndex < array.length) {
    const endIndex = toIndex < 0 ? array.length + toIndex : toIndex;

    const [item] = array.splice(fromIndex, 1);
    array.splice(endIndex, 0, item);
  }
}

function arrayMove(array, fromIndex, toIndex) {
  array = [...array];
  arrayMoveMutable(array, fromIndex, toIndex);
  return array;
}

module.exports = {
  /**
   * @param {import('discord.js').CommandInteraction} interaction interaction received by the API
   */
  async execute(interaction) {
    const gamemode = interaction.options.getString('gamemode');
    const prize = interaction.options.getString('prize');
    const emotes = {
      car: [
        '<:car1:915098252246913035>',
        '<:car2:915098252695711764>',
        '<:car3:915098252787974174>',
        '<:car4:915098252666363965>',
        '<:car5:915098252825751552>',
      ],
      horse: [
        '<:horse1:915098252448260138>',
        '<:horse2:915098252859306045>',
        '<:horse3:915098252666355734>',
        '<:horse4:915098252666359880>',
        '<:horse5:915098253001895936>',
      ],
      bike: [
        '<:bike1:915098252108529745>',
        '<:bike2:915098252272099328>',
        '<:bike3:915098252347592754>',
        '<:bike4:915098252557307914>',
        '<:bike5:915098252246908980>',
      ],
      run: [
        '<a:run1:915098253127729172>',
        '<a:run2:915098253169672212>',
        '<a:run3:915098253232590928>',
        '<a:run4:915098253312282644>',
        '<a:run5:915098253274537994>',
      ],
      pokemon: [
        '<a:pokemon1:915098252859306046>',
        '<a:pokemon2:915098252645396481>',
        '<a:pokemon3:915098252666363968>',
        '<a:pokemon4:915098252926402643>',
        '<a:pokemon5:915098253161275402>',
      ],
    };
    const userEmos = {};
    const winner = [];
    let raceMsg = [];

    const move = async (racemsg, interval) => {
      raceMsg = racemsg.split('\n');
      if (
        !raceMsg.every((e) => {
          if (e.includes('🚩')) return true;
          return false;
        })
      ) {
        raceMsg = raceMsg.map((thing) => {
          if (!thing.includes('🚩')) {
            const movementNumber = Math.round(Math.random() * 3);
            let _obj = thing.split(' ');
            const carrotindex = _obj.indexOf(userEmos[_obj[13]]);
            if (carrotindex - movementNumber < 2) {
              _obj = arrayMove(_obj, carrotindex, 1);
              winner.push(_obj[13]);
              return `🚩 ${_obj.slice(1).join(' ')}`;
            }
            _obj = arrayMove(_obj, carrotindex, carrotindex - movementNumber);
            _obj = _obj.join(' ');

            return _obj;
          }
          return thing;
        });
        return raceMsg.join('\n');
      }

      clearInterval(interval);
      await interaction.followUp({
        embeds: [
          new Embed()
            .setTitle('Game Over')
            .setDescription(
              winner[2]
                ? `<:neo_first:876912509255290920> - ${winner[0]}\n<:neo_second:876912663995772948> - ${winner[1]}\n<:neo_third:876912595767033907> - ${winner[2]}`
                : `<:neo_first:876912509255290920> - ${winner[0]}\n<:neo_second:876912663995772948> - ${winner[1]}`,
            ),
        ],
      });
      return raceMsg.join('\n');
    };
    const join = new MessageButton({
      customId: 'join',
      label: 'Join Race',
      style: 'SUCCESS',
    });

    await interaction.reply({
      embeds: [
        new Embed()
          .setTitle('Race!')
          .setAuthor({ name: 'Starts in 60 seconds' })
          .setDescription(
            "Click the button on this message to enter the race. There's limited space so hurry!",
          )
          .addField('Prize', prize),
      ],
      components: [new MessageActionRow({ components: [join] })],
    });
    const m = await interaction.fetchReply();
    const collector = m.createMessageComponentCollector({
      time: 60000,
    });

    let participants = [];
    collector.on('collect', async (i) => {
      if (!participants.includes(i.user.id)) {
        participants.push(i.user.id);
        userEmos[`<@${i.user.id}>`] =
          emotes[gamemode][Math.floor(Math.random() * emotes[gamemode].length)];
        await i.reply({
          content: 'You have successfully joined the race',
          ephemeral: true,
        });
        if (participants.length >= 25) return collector.stop('players');
      } else {
        await i.reply({
          content: "You've already joined the race!",
          ephemeral: true,
        });
      }
    });

    collector.on('end', async () => {
      await m.edit({
        components: [
          new MessageActionRow({ components: [join.setDisabled(true)] }),
        ],
      });
      if (participants.length < 2) {
        return interaction.followUp(
          'Not enough people joined, get more friends lol',
        );
      }
      participants = participants.map((item) => `<@${item}>`);
      const players = participants.join(', ');
      await interaction.followUp({
        embeds: [
          new Embed()
            .setTitle(`${interaction.user.tag} started a new race!`)
            .addField('Participants:', `${players}`)
            .addField('Race type:', gamemode)
            .addField('Prize:', `${prize}`)
            .addField('# of participants:', `${participants.length}`, true),
        ],
      });

      participants.forEach((player) => {
        raceMsg.push(`🏁 ● ● ● ● ● ● ● ● ● ● ● ${userEmos[player]} ${player}`);
      });

      const racemsg = raceMsg.join('\n');
      let e = racemsg;
      const msg = await interaction.followUp({
        embeds: [
          new Embed({
            footer: { text: `There were ${participants.length} participants` },
          })
            .setTitle(`Race started by ${interaction.user.tag}`)
            .setDescription(racemsg),
        ],
      }); // getting an error from this, fix later: https://i.imgur.com/Oiiz2RB.png
      const interval = setInterval(async () => {
        e = move(e, interval);
        msg.embeds[0].description = e;
        await msg.edit({
          embeds: [msg.embeds[0]],
        });
      }, 3000);
    });
  },
  name: 'race',
  description: 'Start a race event, contestants have 1 minute to join!',
  default_permission: false,
  options: [
    {
      name: 'gamemode',
      description: 'Choose what you want to race as',
      type: 3,
      required: true,
      choices: [
        {
          name: 'car',
          value: 'car',
        },
        {
          name: 'bike',
          value: 'bike',
        },
        {
          name: 'horse',
          value: 'horse',
        },
        {
          name: 'run',
          value: 'run',
        },
        {
          name: 'pokemon',
          value: 'pokemon',
        },
      ],
    },
    {
      name: 'prize',
      description: 'Enter the prize for the game',
      type: 3,
      required: true,
    },
  ],
};
