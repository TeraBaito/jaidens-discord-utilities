const { Message } = require('discord.js');
const Bot = require('../../../index');

module.exports = {
    name: 'clear',
    aliases: ['purge'],
    usage: 'clear [amount of messages]',
    description: 'Clears a specified amount of messages in the current channel, up to 100 messages',

    /** 
     * @param {Bot} bot 
     * @param {Message} message 
     * @param {string[]} args 
     */
    run: async(bot, message, args) => {
        if (message.deletable) message.delete;

        // Member doesn't have perms to delete messages
        if (!message.member.hasPermission('MANAGE_MESSAGES')) {
            return message.channel.send('You don\'t have permission to delete messages, welps')
                .then(m => setTimeout(() => { m.delete(); }, 5000));
        }

        // Bot doesn't have perms to delete messages (it does by default
        if (!message.guild.me.hasPermission('MANAGE_MESSAGES')) {
            return message.channel.send('I don\'t have permissions to delete messages, please enable the "Manage Messages" permission')
                .then(m => setTimeout(() => { m.delete(); }, 5000));
        }

        // Clear amount is not a number or is 0
        if (isNaN(args[0])) {
            return message.channel.send('But this is not a number, send a number of messages to clear')
                .then(m => setTimeout(() => { m.delete(); }, 5000));    
        }

        if (parseInt(args[0] <= 0)) {
            return message.channel.send('Can you send a number that is not 0, you\'re just wasting my time...')
                .then(m => setTimeout(() => { m.delete(); }, 5000));
        }

        let deleteAmount;

        if (parseInt(args[0]) > 100) {
            deleteAmount = 1000;
        } else {
            deleteAmount = parseInt(args[0]) + 1;
        }

        message.channel.bulkDelete(deleteAmount, true)
            .then(deletedNum => message.channel.send(`Deleted \`${deletedNum.size - 1}\` messages. It didn't delete messages older than two weeks old btw`)
                .then(m => setTimeout(() => { m.delete(); }, 5000)))
                
            .catch(err => {
                message.channel.send('Something went wrong...');
                console.log(err);
            });
    }
};