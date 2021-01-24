const Discord = require('discord.js');
const { stripIndents } = require('common-tags');
const { formatDate } = require('../../handlers/functions');
const { welcomer } = require('../../../botSettings.json');
const { jaidenServerID, mainChannel } = require('../../../config.json');
const colors = require('../../../colors.json');

/**
 * `guildMemberAdd` event.
 * 
 * Emitted whenever a user joins a guild.
 * 
 * @param {Discord.Client} bot
 * @param {Discord.GuildMember} member 
 */
module.exports = async (bot, member) => {
    if (!welcomer) return;
    
    const mEmbed = new Discord.MessageEmbed()
        .setColor(colors.Olive)
        .setTitle('Member Joined')
        .addField('Name', member.displayName, true)
        .addField('ID', member.id, true)
        .addField('Joined Server', formatDate(member.joinedAt))
        .addField('Joined Discord', formatDate(member.user.createdAt))
        .setThumbnail(member.user.displayAvatarURL({ format: 'png', dynamic: true }));

    // Just sends a cool message in chat to welcome the user
    if (member.guild.id != jaidenServerID) return;
    bot.channels.cache.get(mainChannel).send(
        stripIndents`Hello, <@${member.id}>. Welcome to r/JaidenAnimations!
    
    Please make sure to read <#755180458563600445> and the pinned comments / topics for this and other channels`);

    bot.guilds.cache.get(jaidenServerID).channels.cache.find(ch => ch.name == 'new-members').send(mEmbed);
};