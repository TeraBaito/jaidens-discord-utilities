const { MessageEmbed } = require('discord.js');
const Bot = require('../../../Bot');
const colors = require('../../../colors.json');

module.exports = {
    name: 'say',
    aliases: ['echo'],
    usage: 'say [#channel] (embed) [message]',
    description: 'Echoes the given args',
    staffOnly: true,

    /** 
     * @param {Bot} bot 
     * @param {Message} message 
     * @param {string[]} args 
     */
    run: async(bot, message, args) => {
        if (!args[1]) return message.channel.send('Please provided the required args according to the help command!');
        
        let channel = message.mentions.channels.first() ||
        message.guild.channels.cache.find(c => c.id == args[0]) ||
        message.guild.channels.cache.find(c => c.name == args[0]);

        if (!channel) return message.channel.send('Couldn\'t find a channel with the arguments provided');

        if (message.deletable) message.delete();
        
        if (args[1] == 'embed') {
            const embeds =  [ new MessageEmbed()
                .setColor(colors.ForestGreen)
                .setDescription(args.slice(2).join(' ')) ];
            
            channel.send({ embeds });
        } else {
            channel.send(args.slice(1).join(' '));
        }
    }
};