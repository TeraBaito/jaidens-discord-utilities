const { Message, MessageEmbed } = require('discord.js');
const Bot = require('../../../index');
const { stripIndents } = require('common-tags');
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

        // Offline and Online member count (integers)
        // Would've substracted offline from guild.memberCount for online but it returned NaN
        let memberStatuses = {
            offline: message.guild.members.cache.filter(member => member.presence.status === 'offline').size,
            online: message.guild.members.cache.filter(member => member.presence.status !== 'offline').size
        };

        let sIcon = message.guild.iconURL();
        let serverEmbed = new MessageEmbed()
            .setDescription('**Server Information**')
            .setColor(colors.Purple)
            .setThumbnail(sIcon)
            .addField('Server Name', message.guild.name)
            .addField('Server ID', message.guild.id)
            .addField('Created On', message.guild.createdAt)
            .addField('Member Count', stripIndents`<:totalmembers:742403092217200640>${message.guild.memberCount} Total\xa0     <:online:742401595446132870>${memberStatuses.online} Online\xa0    <:offline:742401625015976049>${memberStatuses.offline} Offline`)
            .addField('Channel Count', message.guild.channels.cache.size)
            .addField('Server Owner', message.guild.owner.user.tag);
    
        return message.channel.send(serverEmbed);
    }
};