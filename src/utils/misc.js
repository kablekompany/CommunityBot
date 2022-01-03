const { promisify } = require('util');
const ms = require('ms');
const colours = require('../../assets/colours.json');

module.exports = {
  paginate: (data, separator = '\n') => {
    let counter = 0;
    const pages = [];
    pages[counter] = '';
    for (const parts of data) {
      if (pages[counter].length > 1900) {
        counter++;
        pages[counter] = '';
      }
      pages[counter] += parts + separator;
    }
    return pages;
  },

  randomColour: () =>
    Number(
      colours[Math.floor(Math.random() * colours.length)].replace('#', '0x'),
    ),

  codeblock: (msg, language = '') => {
    const backticks = '```';
    return `${backticks}${language}\n${msg}${backticks}`;
  },

  removeDuplicates: (array) => Array.from(new Set(array).values()),

  relativeTime: (date = Date.now()) => `<t:${Math.round(date / 1000)}:R>`,

  randomInArray: (array) => array[Math.floor(Math.random() * array.length)],

  sleep: async (milliseconds) => {
    const wait = promisify(setTimeout);
    await wait(milliseconds);
  },

  timeoutMember: async (msg, reason = 'N/A', duration = 1.2e6) => {
    // 20 minutes = default
    await msg.member.timeout(duration);
    await msg.member.send({
      embeds: [
        {
          title: 'You have been timed out',
          description: `Your timeout ends <t:${Math.round(
            (Date.now() + duration) / 1000,
          )}:R>.\n**Reason**: ${reason}`,
          timestamp: new Date(),
          color: 0xf38842,
        },
      ],
    });
  },

  prettyDate: () => {
    const date = new Date(Date.now() - 1.44e7); // UTC to UTC -4
    const formattedDate = `${['getHours', 'getMinutes', 'getSeconds']
      .map((t) => date[t]().toString().padStart(2, '0'))
      .join(':')} — ${date.toLocaleDateString()}`;
    return formattedDate;
  },

  parseTime: (time) => {
    if (time === 0) {
      return '0s';
    }
    const methods = [
      { name: 'd', count: 86400 },
      { name: 'h', count: 3600 },
      { name: 'm', count: 60 },
      { name: 's', count: 1 },
    ];

    const timeStr = [
      Math.floor(time / methods[0].count).toString() + methods[0].name,
    ];
    for (let i = 0; i < 3; i += 1) {
      timeStr.push(
        Math.floor(
          (time % methods[i].count) / methods[i + 1].count,
        ).toString() + methods[i + 1].name,
      );
    }

    return timeStr.filter((t) => !t.startsWith('0')).join(', ');
  },

  validateTime: (input) => {
    let temp = '';
    let sum = 0;
    const occurrences = {
      d: 0,
      h: 0,
      m: 0,
      s: 0,
    };
    for (const c of input) {
      if (['d', 'h', 'm', 's'].includes(c)) {
        occurrences[c]++;
        temp += c;
        sum += ms(temp.trim());
        temp = '';
      } else {
        temp += c;
      }
    }

    const hasRepeat = Object.values(occurrences).some((e) => e > 1);
    if (temp !== '' || Number.isNaN(sum) || hasRepeat) {
      throw new Error('Invalid time inputted.');
    }
    return sum;
  },
};
