const Interaction = require('../../Interaction');
const { MessageEmbed } = require('discord.js');
const { time } = require('@discordjs/builders');
const { stripIndents } = require('common-tags');
const { owner, ownerID } = require('../../config.json');
const { version } = require('../../package.json');
const colors = require('../../colors.json');

module.exports = new Interaction((bot, interaction) => {
    const icon = bot.user.displayAvatarURL();
    const { heapUsed } = process.memoryUsage();

    const embeds = [ new MessageEmbed()
        .setTitle('**Bot Information**')
        .setDescription(
            stripIndents`> A bot that provides different utilities to the r/JaidenAnimations Discord Server
        > Fast and easy-to-use commands
        > Actions adjusted to the server needs
        > Other cool utils and fun commands

        Source code on [GitHub](https://github.com/TeraBaito/jaidens-discord-utilities)!`
        )  
        .setColor(colors.Orange)
        .setThumbnail(icon)
        .addField('Bot Name', bot.user.tag)
        .addField('Made By', `${owner} (${ownerID})`)
        .addField('Active For', `${(process.uptime() / 3600).toFixed(1)} hours`)
        .addField('Memory Usage', `${(heapUsed / 1024 / 1024).toFixed(1)} MB`)
        .addField('Creation Date', time(bot.user.createdAt))
        .setFooter(`Version: ${version}, coded with discord.js`) ];

    interaction.reply({ embeds });
})
    .setName('about')
    .setDescription('Shows general information about the bot');