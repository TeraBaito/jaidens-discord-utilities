const Discord = require('discord.js');
const { stripIndents } = require('common-tags');
const { readJSONSync } = require('fs-extra');
const { formatDate, unhoistOne } = require('../../handlers/functions');
const { jaidenServerID, mainChannel } = require('../../../config.json');
const colors = require('../../../colors.json');
const eggs = require('../../handlers/eastereggs.json');

/**
 * `guildMemberAdd` event.
 * 
 * Emitted whenever a user joins a guild.
 * 
 * @param {Discord.Client} bot
 * @param {Discord.GuildMember} member 
 */
module.exports = async (bot, member) => {
    const { welcomer } = readJSONSync('./botSettings.json');
    
    if (!welcomer) return;
    
    const mEmbed = new Discord.MessageEmbed()
        .setColor(colors.Olive)
        .setTitle('Member Joined')
        .addField('Name', member.displayName, true)
        .addField('ID', member.id, true)
        .addField('Joined Server', formatDate(member.joinedAt))
        .addField('Joined Discord', formatDate(member.user.createdAt))
        .setThumbnail(member.user.displayAvatarURL({ format: 'png', dynamic: true }));

    // 0 // 0 < 11 = true // eggs[0]
    // 11 // 11 < 11 = false // default
    // 10 // 10 < 11 = true // eggs[10]

    const num = Math.floor(Math.random() * 100);
    const msg = num < eggs.length ?
        `<@${member.id}> ${eggs[num]}` :
        stripIndents`Hello, <@${member.id}>. Welcome to r/JaidenAnimations!
    Please make sure to read <#755180458563600445> and the pinned comments / topics for this and other channels.
    And for the context, Jaiden isn't here :p`;

    // Just sends a cool message in chat to welcome the user
    if (member.guild.id != jaidenServerID) return;
    bot.channels.cache.get(mainChannel).send(msg);

    bot.guilds.cache.get(jaidenServerID).channels.cache.find(ch => ch.name == 'new-members').send(mEmbed);
    unhoistOne(member);
};