const { Message, MessageEmbed } = require('discord.js');
const Bot = require('../../../index');
const { stripIndents } = require('common-tags');
const { owner, ownerID } = require('../../../config.json');
const { version } = require('../../../package.json');
const colors = require('../../../colors.json');
const { formatDate } = require('../../handlers/functions');

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

        let botEmbed = new MessageEmbed()
            .setTitle('**Bot Information**')
            .setDescription(stripIndents`\>\>\> A bot that provides different utilities to the r/JaidenAnimations Discord Server
            Fast and easy-to-use commands
            Actions adjusted to the server needs
            Other cool utils and fun commands`)  
            .setColor(colors.Orange)
            .setThumbnail(bIcon)
            .addField('Bot Name', bot.user.tag)
            .addField('Made By', `${owner} (${ownerID})`)
            .addField('Active For', `${(process.uptime() / 3600).toFixed(1)} hours`)
            .addField('Memory Usage', `${(heapUsed / 1024 / 1024).toFixed(1)} MB`)
            .addField('Creation Date', formatDate(bot.user.createdAt))
            .setFooter(`Version: ${version}, coded with discord.js`);

        return message.channel.send(botEmbed);
    }
};
