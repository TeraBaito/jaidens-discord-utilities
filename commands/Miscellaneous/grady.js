const Discord = require('discord.js');

module.exports = {
    name: 'grady',
    helpName: 'Grady was gone...',
    category: 'Miscellaneous',
    aliases: ['acama'],
    usage: 'grady',
    description: 'The Great Grady has returned.',

    run: async(bot, message, args) => {
        if (message.deletable) message.delete();
        message.channel.send('Grady is back, there\'s no need to use this command anymore.');
    }
};