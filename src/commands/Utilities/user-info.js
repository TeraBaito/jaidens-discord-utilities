const { Message, MessageEmbed } = require('discord.js');
const { time } = require('@discordjs/builders');
const Bot = require('../../../Bot');
const { getMember } = require('../../handlers/functions.js');
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
        const member = args[0] ? await getMember(message, args.join(' ')) : message.member;
        if (!member) return message.channel.send('Couldn\'t find such member.');

        // Roles as strings
        let roles = [
            ...member.roles.cache
                .filter(r => r.id !== message.guild.id)
                .values()
        ].join(' ')  || 'None';
            
        // If the embed is more than 1024 chars it will error
        if (roles.length > 650) roles = 'Too much roles to show!';

        // Discord creation and server join date
        const created = time(member.user.createdAt),
            joined = time(member.joinedAt);
        
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
            .addField('Roles', roles, true) ];

        message.channel.send({ embeds });
    }
};