const Discord = require('discord.js'),
    colors = require('../../colors.json'),
    { getMember } = require('../../handlers/functions.js');

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