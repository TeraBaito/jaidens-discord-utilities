const { Message, MessageEmbed } = require('discord.js');
const Bot = require('../../../Bot');
const colors = require('../../../colors.json');

module.exports = {
    name: 'cembed',
    aliases: ['jsonembed'],
    usage: 'cembed [channel] [json-embed]',
    description: 'Sends an embed using JSON format to the specified channel',
    staffOnly: true,

    /** 
     * @param {Bot} bot 
     * @param {Message} message 
     * @param {string[]} args 
     */
    run: async (bot, message, args) => {
        if (!args[1]) return message.channel.send('Please specify the needed args according to the help command');

        let channel = message.mentions.channels.first() ||
        message.guild.channels.cache.get(args[0]) ||
        message.guild.channels.cache.find(c => c.name == args[0]);

        if (!channel) return message.channel.send('The channel provided can\'t be found!');

        try {
            let jsonEmbed = JSON.parse(args.slice(1).join(' '));
            channel.send({ embeds: [jsonEmbed] });

            message.channel.send('Successfully sent embed!');
        } catch (e) {
            const errEmbed = new MessageEmbed()
                .setColor(colors.Red)
                .setTitle('Error')
                .setDescription(e.toString())
                .setFooter(bot.user.username, bot.user.displayAvatarURL);
            
            message.channel.send({ embeds: [errEmbed] });
        }
    }
};