const Discord = require('discord.js');
const { stripIndents } = require('common-tags');

/**
 * `guildMemberAdd` event.
 * 
 * Emitted whenever a user joins a guild.
 * 
 * @param {Discord.GuildMember} member 
 */
module.exports = async (bot, member) => {
    // Just sends a cool message in chat to welcome the user
    if (member.guild.id != '754451472699228281') return;
    bot.channels.cache.get('755182878635327529').send(
        stripIndents`Hello, <@${member.id}>. Welcome to r/JaidenAnimations!
    
    Please make sure to read <#755180458563600445> and the pinned comments / topics for this and other channels`);
};