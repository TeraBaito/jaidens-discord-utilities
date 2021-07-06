const Bot = require('../../../Bot');
const chalk = require('chalk');
const { publishInteractions } = require('../../handlers/functions');

/**
 * `ready` event.
 * Triggers once the bot loads all the other events and goes online.
 * Useful to show ready messages and do/set things at startup.
 * 
 * @param {Bot} bot 
 */
module.exports = async bot => {
    bot.user.setActivity('you', { type: 'WATCHING' });
    if (process.argv.includes('-i')) await publishInteractions(bot); 
    console.info(`${chalk.green('[Info]')} - ${bot.user.username} online!`); 
};