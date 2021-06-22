const { GuildMember, MessageEmbed } = require('discord.js');
const Bot = require('../../../index');
const { readJSONSync } = require('fs-extra');
const { jaidenServerID, mainChannel } = require('../../../config.json');
const colors = require('../../../colors.json');


/**
 * `guildMemberRemove` event.
 * 
 * Emitted whenever a user leaves a guild.
 * 
 * @param {Bot} bot
 * @param {GuildMember} member 
 */
module.exports = async (bot, member) => {
    const { welcomer } = readJSONSync('./botSettings.json');
    if (!welcomer || member.guild.id != jaidenServerID) return;

    const mEmbed = new MessageEmbed()
        .setColor(colors.Peru)
        .setTitle('Member Left')
        .addField('Name', member.displayName, true)
        .addField('ID', member.id);

    // ok cya
    if (member.guild.id != jaidenServerID) return;
    bot.channels.cache.get(mainChannel).send(`Welps, guess like **${member.displayName}** couldn't stand to be around us, adiós.`);
    bot.guilds.cache.get(jaidenServerID).channels.cache.find(ch => ch.name == 'new-members').send(mEmbed);
};