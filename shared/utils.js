'use strict';
const Discord = require('discord.js');

const {
  BOT_TITLE,
  BOT_GIT_URL,
  BOT_FOOTER_MSG,
  BOT_FOOTER_IMG
} = process.env;

const generateTemplate = (args) => {

  const { botColor } = args;
  
  return new Discord.MessageEmbed()
    .setColor(botColor)
    .setTitle(BOT_TITLE)
    .setURL(BOT_GIT_URL)
    .setThumbnail(BOT_FOOTER_IMG)
    .setTimestamp()
    .setFooter(BOT_FOOTER_MSG, BOT_FOOTER_IMG);
}

const botTemplate = (args) => {
  const { fields } = args;
  const template = generateTemplate(args);
  fields.map(field => template.addField(field.name, field.value, (field.inline)));
  return template;
}

const utils = {
  botTemplate
}

module.exports = utils;
