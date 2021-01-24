const Discord = require('discord.js');
const { welcomer } = require('../../../botSettings.json');
const { jaidenServerID, mainChannel } = require('../../../config.json');
const colors = require('../../../colors.json');


/**
 * `guildMemberRemove` event.
 * 
 * Emitted whenever a user leaves a guild.
 * 
 * @param {Discord.Client} bot
 * @param {Discord.GuildMember} member 
 */
module.exports = async (bot, member) => {
    if (!welcomer) return;

    const mEmbed = new Discord.MessageEmbed()
        .setColor(colors.Peru)
        .setTitle('Member Left')
        .addField('Name', member.displayName, true)
        .addField('ID', member.id);

    // ok cya
    if (member.guild.id != jaidenServerID) return;
    bot.channels.cache.get('755182878635327529').send(`Welps, guess like **${member.displayName}** couldn't stand to be around us, adiós.`);
    bot.guilds.cache.get(jaidenServerID).channels.cache.find(ch => ch.name == 'new-members').send(mEmbed);
};