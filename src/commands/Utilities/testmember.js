const Discord = require('discord.js');
const { getMember } = require('../../handlers/functions');

module.exports = {
    name: 'testmember',
    helpName: 'test member',
    category: 'Utilities',
    // aliases: [],
    usage: 'testing only',
    description: 'test command to get member data',
    run: async(bot, message, args) => {
        let data = getMember(message, args.join(' '));
        message.channel.send(data.displayName);
    }
};