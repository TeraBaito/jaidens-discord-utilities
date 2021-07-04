const { Message } = require('discord.js');
const Bot = require('../../../Bot');

module.exports = {
    name: 'a',
    hidden: true,
    aliases: ['shrimps-favorite-command'],
    usage: 'a',
    description: 'Shrimp\'s favorite command',
    cooldown: 10,

    /**
    * @param {Bot} bot
    * @param {Message} message
    * @param {string[]} args
    */
    run: async(bot, message, args) => {
        if (!['558264504736153600', '291684752363225098', '488064501816492047']
            .includes(message.author.id)) 
        
            return message.channel.send('lmao no, this command is only shrimp irony idot. good luck next time or not');

        if (message.deletable) message.delete();
    }
};