/**
 * `guildMemberAdd` event
 * Emitted whenever a user joins a guild
 */

const Discord = require('discord.js');

module.exports = async (bot, member, message) => {
    // Just sends a cool message in chat to welcome the user (unless it's a bot bc :moyai:)
    if (!message.author.bot) bot.channels.get('755182878635327529').send(`Hello, ${member.id}. Welcome to r/JaidenAnimations!`);
};