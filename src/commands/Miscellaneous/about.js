const { Message, MessageEmbed } = require('discord.js');
const { time } = require('@discordjs/builders');
const { stripIndents } = require('common-tags');
const Bot = require('../../../Bot');
const { owner, ownerID } = require('../../../config.json');
const { version } = require('../../../package.json');
const colors = require('../../../colors.json');

module.exports = { 
    name: 'about',
    aliases: ['bot-info'],
    usage: 'about',
    description: 'General Bot Information',

    /** 
     * @param {Bot} bot 
     * @param {Message} message 
     * @param {string[]} args 
     */
    run: async (bot, message, args) => {
        let bIcon = bot.user.displayAvatarURL();
        let { heapUsed } = process.memoryUsage();

        let embeds = [ new MessageEmbed()
            .setTitle('**Bot Information**')
            .setDescription(
                stripIndents`> A bot that provides different utilities to the r/JaidenAnimations Discord Server
            > Fast and easy-to-use commands
            > Actions adjusted to the server needs
            > Other cool utils and fun commands

            Source code on [GitHub](https://github.com/TeraBaito/jaidens-discord-utilities)!`
            )  
            .setColor(colors.Orange)
            .setThumbnail(bIcon)
            .addField('Bot Name', bot.user.tag)
            .addField('Made By', `${owner} (${ownerID})`)
            .addField('Active For', `${(process.uptime() / 3600).toFixed(1)} hours`)
            .addField('Memory Usage', `${(heapUsed / 1024 / 1024).toFixed(1)} MB`)
            .addField('Creation Date', time(bot.user.createdAt))
            .setFooter(`Version: ${version}, coded with discord.js`) ];

        return message.channel.send({ embeds });
    }
};
