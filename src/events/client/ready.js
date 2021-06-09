const Bot = require('../../../index');
const chalk = require('chalk');

/**
 * `ready` event.
 * Triggers once the bot loads all the other events and goes online.
 * Useful to show ready messages and do/set things at startup.
 * 
 * @param {Bot} bot 
 */
module.exports = bot => {
    bot.user.setActivity('you', { type: 'WATCHING' });
    console.info(`${chalk.green('[Info]')} - ${bot.user.username} online!`);
    const force = process.argv.includes('--force') || process.argv.includes('-f');
    bot.tags.sync({ force });
};