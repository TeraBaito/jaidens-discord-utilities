const { MessageEmbed, GuildMember } = require('discord.js');
const Bot = require('../../../Bot');
const { unhoistOne } = require('../../handlers/functions');
const { jaidenServerID } = require('../../../config.json');
const colors = require('../../../colors.json');
const { time } = require('@discordjs/builders');


/**
 * `guildMemberAdd` event.
 * 
 * Emitted whenever a user joins a guild.
 * 
 * @param {Bot} bot
 * @param {GuildMember} member 
 */
module.exports = async (bot, member) => {
    if (member.guild.id != jaidenServerID) return;
    
    const embeds = [ new MessageEmbed()
        .setColor(colors.Olive)
        .setTitle('Member Joined')
        .addField('Name', member.displayName, true)
        .addField('ID', member.id, true)
        .addField('Joined Server', time(member.joinedAt))
        .addField('Joined Discord', time(member.user.createdAt))
        .setThumbnail(member.user.displayAvatarURL({ format: 'png', dynamic: true })) ];

    bot.guilds.cache.get(jaidenServerID).channels.cache.find(ch => ch.name == 'member-logs').send({ embeds });
    unhoistOne(member);
};