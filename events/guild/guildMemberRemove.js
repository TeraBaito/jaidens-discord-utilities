/**
 * `guildMemberRemove` event
 * Emitted whenever a user leaves a guild
 */

const Discord = require('discord.js');

module.exports = async (bot, member, message) => {
    // ok cya
    bot.channels.cache.get('755182878635327529').send(`Welps, guess like ${member.displayName} couldn't stand to be around us, adiós.`);
};