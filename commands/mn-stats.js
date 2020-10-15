'use strict';
const got = require('got');

const utils = require('../shared/utils');
const constants = require('../shared/constants');

const { DIVI } = constants;

const {
  BOT_COMMAND2,
  BASE_ENDPOINT,
  EXTERNAL_LINK_1,
  MN_STATS_ENDPOINT,
  BOT_COLOR_SUCCESS,
  BOT_COMMAND2_DESC,
} = process.env;


// execute handler
const execute = async (msg, args) => {
  try {

    const result = await getMNStats();
    const { stats, statsDisabled } = result;

    const totalsEnabled = getMNStatsTotalsGrouped(stats); 
    const totalsDisabled = getMNStatsTotalsGrouped(statsDisabled);  
    const absTotal = totalsEnabled + totalsDisabled;

    const { COPPER, SILVER, GOLD, PLATINUM, DIAMOND } = DIVI;
  
    const fields = [
      {
        name: `🥉 ${COPPER.label}`,
        inline: true,
        value: `${stats[COPPER.label].length}/${(stats[COPPER.label].length) + (statsDisabled[COPPER.label].length)}`
      },
      {
        name: `🥈 ${SILVER.label}`,
        inline: true,
        value: `${stats[SILVER.label].length}/${(stats[SILVER.label].length + (statsDisabled[SILVER.label].length))}`
      },
      {
        name: `🥇 ${GOLD.label}`,
        inline: true,
        value: `${stats[GOLD.label].length}/${(stats[GOLD.label].length + (statsDisabled[GOLD.label].length))}`
      },
      {
        name: '\u200b',
        inline: false,
        value: '\u200b'
      },
      {
        name: `▫ ${PLATINUM.label}`,
        inline: true,
        value: `${stats[PLATINUM.label].length}/${(stats[PLATINUM.label].length + (statsDisabled[PLATINUM.label].length))}`
      },
      {
        name: `💎 ${DIAMOND.label}`,
        inline: true,
        value: `${stats[DIAMOND.label].length}/${(stats[DIAMOND.label].length )}`
      },
      {
        name: `🔥 TOTAL`,
        inline: true,
        value: `${absTotal}`
      },
      {
        name: '\u200b',
        inline: false,
        value: '\u200b'
      },
      {
        name: '❤',
        inline: true,
        value: EXTERNAL_LINK_1
      }
    ];

    const args = { 
      fields, 
      description: 'DIVI MN Stats',
      botColor: BOT_COLOR_SUCCESS 
    };
    const template = utils.botTemplate(args);

    msg.channel.send(template);
  } catch(error) {

    const template = utils.defaultErrorTemplate();
    msg.channel.send(template);
    console.error('error', error);
    //throw(error);
  }
}

// internal use
const getMNStatsTotalsGrouped = (array) => {
  
  // mapping
  const { COPPER, SILVER, GOLD, PLATINUM, DIAMOND } = DIVI;
  const copperStats = array[COPPER.label]     || [];
  const silverStats = array[SILVER.label]     || [];
  const goldStats = array[GOLD.label]         || [];
  const platinumStats = array[PLATINUM.label] || [];
  const diamondStats = array[DIAMOND.label]   || [];
  
  const total = (
    copperStats.length + 
    silverStats.length +
    goldStats.length + 
    platinumStats.length +
    diamondStats.length
  );
  return total;
}
const getMNStats = () => {
  return new Promise(async (resolve, reject) => {
    try {

      const endpoint = `${BASE_ENDPOINT}${MN_STATS_ENDPOINT}`;
      const headers = { responseType: 'json' };
      const { body } = await got(endpoint, headers);

      const stats = {
        COOPER: [],
        SILVER: [],
        GOLD: [],
        PLATINUM: [],
        DIAMOND: []
      };

      const statsDisabled = {
        COPPER: [],
        SILVER: [],
        GOLD: [],
        PLATINUM: [],
        DIAMOND: [] 
      };

      body.map(MN => {

        const { tier, status } = MN;

        // group by status
        const { DISABLED_STATUS, ENABLED_STATUS } = constants;

        // disabled ones
        if (status === DISABLED_STATUS) {
          return statsDisabled[tier] =  (!statsDisabled[tier]) 
          ? statsDisabled[tier] = [] // group by tier
          : statsDisabled[tier] = [...statsDisabled[tier], MN]; // insert related ones
        };

        // enabled ones
        if (status === ENABLED_STATUS) {
          return stats[tier] = (!stats[tier]) 
          ? stats[tier] = [] // group by tier
          : stats[tier] = [...stats[tier], MN]; // insert related ones
        }
      });

      const result = { stats, statsDisabled };
      return resolve(result);
    } catch (error) {
      
      console.error('getPrice::ERROR', error);
      return reject(error);
    }
  });
}

// public access
module.exports = {
  execute,
  name: BOT_COMMAND2,
  description: BOT_COMMAND2_DESC
};