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

  prettyDate: () => {
    const date = new Date(Date.now() - 1.44e7); // UTC to UTC -4
    const formattedDate = `${['getHours', 'getMinutes', 'getSeconds']
      .map((t) => date[t]().toString().padStart(2, '0'))
      .join(':')} — ${date.toLocaleDateString()}`;
    return formattedDate;
  },
};
