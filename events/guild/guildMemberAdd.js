const Discord = require('discord.js');

/**
 * `guildMemberAdd` event.
 * 
 * Emitted whenever a user joins a guild.
 * 
 * @param {Discord.GuildMember} member 
 */
module.exports = async (bot, member) => {
    // Just sends a cool message in chat to welcome the user
    bot.channels.cache.get('755182878635327529').send(`Hello, <@${member.id}>. Welcome to r/JaidenAnimations!`);
};