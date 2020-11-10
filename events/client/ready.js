const Discord = require('discord.js');

/**
 * `ready` event.
 * Triggers once the bot loads all the other events and goes online.
 * Useful to show ready messages and do/set things at startup.
 * 
 * @param {Discord.Client} bot 
 */
module.exports = async bot => {
    bot.user.setActivity('you', {type:'WATCHING'});
    console.log(`${bot.user.username} online`);
};