const { Message, MessageEmbed } = require('discord.js');
const Bot = require('../../../Bot');
const colors = require('../../../colors.json');
const { getMember } = require('../../handlers/functions.js');

module.exports = {
    name: 'avatar',
    aliases: ['pfp', 'profile-picture'],
    usage: 'avatar (user)',
    description: 'Shows the profile picture of you or a specified user',

    /** 
     * @param {Bot} bot 
     * @param {Message} message 
     * @param {string[]} args 
     */
    run: async(bot, message, args) => {
        let member = args[0] ? await getMember(message, args.join(' ')) : message.member;
        const uIcon = member.user.displayAvatarURL({ format: 'png', size: 4096, dynamic: true });

        const embeds = [ new MessageEmbed()
            .setColor(colors.ForestGreen)
            .setDescription(`**${member.displayName}'s Avatar**`)
            .setImage(uIcon) ];

        message.channel.send({ embeds });
    }
};