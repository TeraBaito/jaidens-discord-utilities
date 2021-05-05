const { Message, MessageEmbed } = require('discord.js');
const Bot = require('../../../index');
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
        const member = getMember(message, args.join(' '));

        // Information Variables

        // Profile Picture
        const uIcon = member.user.displayAvatarURL();

        // Roles as strings
        let uRoles = member.roles
            .cache.filter(r => r.id !== message.guild.id)
            .map(r => r)
            .join(' ')  || 'none';
            
        // Discord creation and server join date
        const uCreated = formatDate(member.user.createdAt);
        const sJoined = formatDate(member.joinedAt);
        
        // If the embed is more than 1024 chars it will error
        if (uRoles.length > 650) uRoles = 'Too much roles to show!';
        
        // Embed
        const userEmbed = new MessageEmbed()
            .setDescription('**User Information**')
            .setFooter(member.displayName, uIcon)
            .setThumbnail(uIcon)
            .setColor(colors.PaleBlue)
            .addField('Display Name', member.displayName)
            .addField('Username', member.user.tag)
            .addField('User ID', member.user.id)
            .addField('Joined Discord On', uCreated)
            .addField('Joined Server On', sJoined)
            .addField('Roles Count', member.roles.cache.size)
            .addField('Roles', uRoles, true)
            .setTimestamp();

        message.channel.send(userEmbed);
    }
};