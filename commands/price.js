'use strict';
const got = require('got');
const moment = require('moment-timezone');

const utils = require('../shared/utils');

const {
  DATE_FORMAT,
  BOT_COMMAND1,
  BASE_ENDPOINT,
  PRICE_ENDPOINT,
  BOT_COLOR_ERROR,
  BOT_COLOR_SUCCESS,
  BOT_COMMAND1_DESC
} = process.env;


// execute handler
const execute = async (msg, args) => {
  try {

    const result = await getPrice();
    const { rank, quotes } = result;

    //console.log(rank, quotes);

    const { BTC, USD } = quotes;

    const BTC_lastUpdated = moment(BTC.lastUpdated).utc().format(DATE_FORMAT)
    const USD_lastUpdated = moment(USD.lastUpdated).utc().format(DATE_FORMAT)

    const fields = [
      {
        name: '🏆',
        inline: false,
        value: `#${rank}`
      },
      {
        name: 'USD Price',
        inline: true,
        value: `$ ${USD.price.toFixed(5)}`
      },
      {
        name: 'BTC Price',
        inline: true,
        value: `₿ ${BTC.price.toFixed(8)}`
      },
      {
        name: '\u200b',
        inline: false,
        value: 'UTC'
      },
      {
        name: 'Last updated',
        inline: true,
        value: `${USD_lastUpdated}`
      },
      {
        name: 'Last updated',
        inline: true,
        value: `${BTC_lastUpdated}`
      }
    ];

    const args = { fields, botColor: BOT_COLOR_SUCCESS };
    const template = utils.botTemplate(args);

    msg.channel.send(template);
  } catch(error) {

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
    const template = utils.botTemplate(args);

    msg.channel.send(template);
    console.error('error', error);
    //throw(error);
  }
}

// internal use
const getPrice = () => {
  return new Promise(async (resolve, reject) => {
    try {

      const endpoint = `${BASE_ENDPOINT}${PRICE_ENDPOINT}`;
      const headers = { responseType: 'json' };
      const { body } = await got(endpoint, headers);

      const { rank, quotes } = body;
      const data = { rank, quotes }

      return resolve(data);
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
  description: BOT_COMMAND1_DESC
};