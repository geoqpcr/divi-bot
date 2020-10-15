'use strict';
const Discord = require('discord.js');

const {
  BOT_TITLE,
  BOT_GIT_URL,
  BOT_FOOTER_MSG,
  BOT_FOOTER_IMG,
  BOT_COLOR_ERROR
} = process.env;

const generateTemplate = (args) => {

  const { botColor, description = '' } = args;
  
  return new Discord.MessageEmbed()
    .setColor(botColor)
    .setTitle(BOT_TITLE)
    .setDescription(description)
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

const defaultErrorTemplate = () => {
  const fields = [
    {
      name: '...',
      inline: false,
      value: 'sit tight · wait patiently'
    },
    {
      name: '\u200b',
      inline: false,
      value: '\u200b'
    },
    {
      name: '🦧 🌴 🦍',
      inline: false,
      value: 'Our team is working!'
    }
  ];

  const args = { fields, botColor: BOT_COLOR_ERROR };
  return botTemplate(args);
}

const utils = {
  botTemplate,
  defaultErrorTemplate
}

module.exports = utils;
