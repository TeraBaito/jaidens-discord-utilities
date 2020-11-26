const Discord = require('discord.js'),
    chalk = require('chalk');
/**
 * `ready` event.
 * Triggers once the bot loads all the other events and goes online.
 * Useful to show ready messages and do/set things at startup.
 * 
 * @param {Discord.Client} bot 
 */
module.exports = bot => {
    bot.user.setActivity('you', { type: 'WATCHING' });
    console.info(`${chalk.green('[Info]')} - ${bot.user.username} online!`);
};