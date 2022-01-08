const { Message, MessageEmbed } = require('discord.js');
const { time } = require('@discordjs/builders');
const Bot = require('../../../Bot');
const colors = require('../../../colors.json');

module.exports = {
    name: 'server',
    aliases: ['server-info'],
    usage: 'server',
    description: 'Server information',

    /** 
     * @param {Bot} bot 
     * @param {Message} message 
     * @param {string[]} args 
     */
    run: async (bot, message, args) => {
        let sIcon = message.guild.iconURL();
        const owner = await message.guild.fetchOwner();

        let embeds = [ new MessageEmbed()
            .setDescription('**Server Information**')
            .setColor(colors.Purple)
            .setThumbnail(sIcon)
            .addField('Name', message.guild.name)
            .addField('ID', message.guild.id)
            .addField('Created On', time(message.guild.createdAt))
            .addField('Member Count', `<:totalmembers:742403092217200640>${message.guild.memberCount} Total`)
            .addField('Channel Count', message.guild.channels.cache.size.toString())
            .addField('Owner', owner.toString()) ];
    
        return message.channel.send({ embeds });
    }
};