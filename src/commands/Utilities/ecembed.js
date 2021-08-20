const { Message, MessageEmbed } = require('discord.js');
const Bot = require('../../../Bot');
const colors = require('../../../colors.json');

module.exports = {
    name: 'ecembed',
    aliases: ['editjsonembed'],
    usage: 'ecembed [message-id] [channel] [json-embed]',
    description: 'Edits an embed message using JSON format to the specified channel',
    staffOnly: true,

    /** 
     * @param {Bot} bot 
     * @param {Message} message 
     * @param {string[]} args 
     */
    run: async(bot, message, args) => {
        if (!args[2]) return message.channel.send('Please specify the needed args according to the help command');

        let channel = message.mentions.channels.first() ||
        message.guild.channels.cache.find(c => c.id == args[1]) ||
        message.guild.channels.cache.find(c => c.name == args[1]);

        if (!channel) return message.channel.send('The channel provided can\'t be found!');

        try {
            let jsonEmbed = JSON.parse(args.slice(2).join(' '));
            channel.messages.fetch(args[0])
                .then(msg => {
                    msg.edit({ embeds: [jsonEmbed] });
                    message.channel.send('Successfully edited embed!');
                });

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