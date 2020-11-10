const Discord = require('discord.js');
const { getMember } = require('../../handlers/functions.js');
const colors = require('../../colors.json');

module.exports = {
    name: 'avatar',
    helpName: 'Avatar',
    category: 'Utilities',
    aliases: ['pfp', 'profile-picture'],
    // cooldown: ,
    usage: 'avatar (user)',
    description: 'Shows the profile picture of you or a specified user',

    run: async(bot, message, args) => {
        let member = await getMember(message, args.join(' '));
        const uIcon = member.user.displayAvatarURL();

        const aEmbed = new Discord.MessageEmbed()
            .setColor(colors.ForestGreen)
            .setDescription(`**${member.displayName}'s Avatar**`)
            .setImage(uIcon);

        message.channel.send(aEmbed);
    }
};