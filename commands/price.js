'use strict';
const got = require('got');
const Discord = require('discord.js');

const {
  CG_URI,
  CG_PRICE,
  BOT_COLOR,
  BOT_TITLE,
  BOT_GIT_URL,
  BOT_COMMAND1,
  BOT_CG_PAIR1,
  BOT_FOOTER_MSG,
  BOT_FOOTER_IMG,
  BOT_COMMAND1_DESC,
  BOT_CG_PAIR1_RES_MAPPING
} = process.env;

function generateTemplate(fields) {
  return new Discord.MessageEmbed()
    .setColor(BOT_COLOR)
    .setTitle(BOT_TITLE)
    .setURL(BOT_GIT_URL)
    .setThumbnail(BOT_FOOTER_IMG)
    .addFields(fields)
    .setTimestamp()
    .setFooter(BOT_FOOTER_MSG, BOT_FOOTER_IMG);
}

// execute handler
const execute = async (msg, args) => {
  try {

    const result = await getPrice(`${BOT_CG_PAIR1}`);
    
    const usd = result[BOT_CG_PAIR1_RES_MAPPING];
    let { usd: value } = usd;

    const fields = { 
      name: 'Price',  
      value: `$${value}` 
    };

    const template = generateTemplate(fields);
    msg.channel.send(template);
  } catch(error) {
    throw(error);
  }
}

// internal use
const getPrice = (pairs) => {
  return new Promise(async (resolve, reject) => {
    try {

      const endpoint = `${CG_URI}${CG_PRICE}${pairs}`;
      let { body } = await got(endpoint);
      body = JSON.parse(body);

      return resolve(body);
    } catch (error) {
      
      console.error('getPrice::ERROR', error);
      return reject(error);
    }
  });
}

// public access
module.exports = {
  execute,
  name: BOT_COMMAND1,
  description: BOT_COMMAND1_DESC,
};