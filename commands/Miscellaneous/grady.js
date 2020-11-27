const Discord = require('discord.js');

module.exports = {
    name: 'grady',
    helpName: 'Grady gone...',
    category: 'Miscellaneous',
    aliases: ['acama'],
    usage: 'grady',
    description: 'He will come back.',

    run: async(bot, message, args) => {
        if (message.deletable) message.delete();
        message.channel.send('Acama (Grady), is taking a break from Discord. However, he will return.');
    }
};