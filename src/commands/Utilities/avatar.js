const Discord = require('discord.js');
const colors = require('../../../colors.json');
const { getMember } = require('../../handlers/functions.js');

module.exports = {
    name: 'avatar',
    helpName: 'Avatar',
    category: 'Utilities',
    aliases: ['pfp', 'profile-picture'],
    // cooldown: ,
    usage: 'avatar (user)',
    description: 'Shows the profile picture of you or a specified user',

    /** 
     * @param {Discord.Client} bot 
     * @param {Discord.Message} message 
     * @param {Array} args 
     */
    run: async(bot, message, args) => {
        let member = getMember(message, args.join(' '));
        const uIcon = member.user.displayAvatarURL({ format: 'png', size: 4096, dynamic: true });

        const aEmbed = new Discord.MessageEmbed()
            .setColor(colors.ForestGreen)
            .setDescription(`**${member.displayName}'s Avatar**`)
            .setImage(uIcon);

        message.channel.send(aEmbed);
    }
};