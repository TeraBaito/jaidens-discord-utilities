const { Message, MessageEmbed } = require('discord.js');
const Bot = require('../../../Bot');
const { getMember, formatDate } = require('../../handlers/functions.js');
const colors = require('../../../colors.json');

module.exports = {
    name: 'user-info',
    aliases: ['profile', 'user', 'whois'],
    usage: 'user-info ({@user, ID})',
    description: 'Sends the general information of a guild member.\n**Attention:** Only @mentions and user IDs work, `;user-info Cookie` doesn\'t work.',

    /** 
     * @param {Bot} bot 
     * @param {Message} message 
     * @param {string[]} args 
     */
    run: async (bot, message, args) => {
        if (!args[0]) return message.channel.send('Please specify a user!');

        const member = await getMember(message, args.join(' '));
        if (!member) return message.channel.send('Couldn\'t find such member.');

        // Roles as strings
        let roles = member.roles.cache
            .filter(r => r.id !== message.guild.id)
            .array()
            .join(' ')  || 'None';
            
        // If the embed is more than 1024 chars it will error
        if (roles.length > 650) roles = 'Too much roles to show!';

        // Discord creation and server join date
        const created = formatDate(member.user.createdAt),
            joined = formatDate(member.joinedAt);
        
        // Embed
        const embeds = [ new MessageEmbed()
            .setDescription('**User Information**')
            .setFooter(member.displayName)
            .setThumbnail(member.user.displayAvatarURL())
            .setColor(colors.PaleBlue)
            .addField('Display Name', member.displayName)
            .addField('Username', member.user.tag)
            .addField('User ID', member.user.id)
            .addField('Joined Discord On', created)
            .addField('Joined Server On', joined)
            .addField('Roles Count', member.roles.cache.size.toString())
            .addField('Roles', roles, true)
            .setTimestamp() ];

        message.channel.send({ embeds });
    }
};