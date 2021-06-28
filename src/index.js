const BotModel = require('./models/Bot/BotModel');
const { botToken } = require('./configs/secrets.json');

const client = new BotModel(botToken);

client.launch();
