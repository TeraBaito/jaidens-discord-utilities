/**
 * `ready` event
 * Triggers once the bot loads all the other events and goes online
 * Useful to show ready messages and do/set things at startup
 */

const Discord = require('discord.js');

module.exports = async bot => {
    bot.user.setActivity('you', {type:'WATCHING'});
    console.log(`${bot.user.username} online`);
};