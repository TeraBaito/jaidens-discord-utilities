const { Message, MessageEmbed } = require('discord.js');
const Bot = require('../../../index');
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
        let member = getMember(message, args.join(' '));
        const uIcon = member.user.displayAvatarURL({ format: 'png', size: 4096, dynamic: true });

        const aEmbed = new MessageEmbed()
            .setColor(colors.ForestGreen)
            .setDescription(`**${member.displayName}'s Avatar**`)
            .setImage(uIcon);

        message.channel.send(aEmbed);
    }
};