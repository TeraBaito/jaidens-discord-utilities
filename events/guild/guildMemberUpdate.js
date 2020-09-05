/**
 * `guildMemberUpdate` event
 * Triggers every time any user's changes are made
 * Useful to do different actions when they happen (like logging)
 * Takes two parameters: oldMember and newMember
 * You can do a check that searches for a specific type of change that oldMember doesn't have and newMember does
 */

const Discord = require('discord.js');
const message = require('./message');

module.exports = async (bot, oldMember, newMember, message) => {
    if (!oldMember.roles.cache.find(r=>r.name==='Member') && newMember.roles.cache.find(r=>r.name==='Member')) {
        const welcomeChannel = bot.channels.cache.get('748896300346507284'); // Server's #chat channel ID
        welcomeChannel.send(`Hello, <@${newMember.id}>. Welcome to r/JaidenAnimations!`);
    }
};