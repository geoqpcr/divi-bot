require('dotenv').config();

const { TOKEN } = process.env;

const Discord = require('discord.js');
const bot = new Discord.Client();
      bot.commands = new Discord.Collection();
const botCommands = require('./commands');

const init = async (botCommands) => {

  // login
  bot.login(TOKEN);

  // bot started
  bot.on('ready', () => {

    console.info(`Logged in as ${bot.user.tag}!`);

    // set commands
    setBotCommands(bot, botCommands);
  });

  // commands processing
  bot.on('message', msg => {

    const { content } = msg;
    const args = content.split(/ +/);

    const command = args.shift().toLowerCase();
    //console.info(`Called command xd: ${command}`);
  
    if (!bot.commands.has(command)) return;
  
    try {

      bot.commands.get(command).execute(msg, args);
    } catch (error) {

      console.error(error);
      msg.reply('there was an error trying to execute that command!');
    }
  });
}

// entry point
init(botCommands);

// utils
const setBotCommands = (bot, commands) => {
  Object.keys(commands).map(key => {
    bot.commands.set(commands[key].name, commands[key]);
  });
}