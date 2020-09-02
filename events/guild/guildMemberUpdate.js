const Discord = require('discord.js');
const message = require('./message');

module.exports = async (bot, oldMember, newMember, message) => {
    if (!oldMember.roles.cache.find(r=>r.name==='Member') && newMember.roles.cache.find(r=>r.name==='Member')) {
        const welcomeChannel = bot.channels.cache.get('748896300346507284'); // Server's #chat channel ID
        welcomeChannel.send(`Hello, <@${newMember.id}>. Welcome to r/JaidenAnimations!`);
    }
};