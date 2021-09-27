const { MessageEmbed, GuildMember } = require('discord.js');
const { stripIndents } = require('common-tags');
const { readJSONSync } = require('fs-extra');
const Bot = require('../../../Bot');
const { unhoistOne } = require('../../handlers/functions');
const { jaidenServerID, mainChannel } = require('../../../config.json');
const eggs = require('../../handlers/eastereggs.json');
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

    const { shitVerification, welcomer } = readJSONSync('./botSettings.json');
    if (welcomer && !shitVerification) {
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
        bot.channels.cache.get(mainChannel).send(msg);
    }

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