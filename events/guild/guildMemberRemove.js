const Discord = require('discord.js');

/**
 * `guildMemberRemove` event.
 * 
 * Emitted whenever a user leaves a guild.
 * 
 * @param {Discord.GuildMember} member 
 */
module.exports = async (bot, member) => {
    // ok cya
    if (member.guild.id != '754451472699228281') return;
    bot.channels.cache.get('755182878635327529').send(`Welps, guess like **${member.displayName}** couldn't stand to be around us, adiós.`);
};