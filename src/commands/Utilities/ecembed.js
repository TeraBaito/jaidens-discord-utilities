const { Message, MessageEmbed } = require('discord.js');
const Bot = require('../../../index');
const colors = require('../../../colors.json');
const { checkStaff } = require('../../handlers/functions');

module.exports = {
    name: 'ecembed',
    aliases: ['editjsonembed'],
    usage: 'ecembed [message-id] [channel] [json-embed]',
    description: 'Edits an embed message using JSON format to the specified channel',

    /** 
     * @param {Bot} bot 
     * @param {Message} message 
     * @param {string[]} args 
     */
    run: async(bot, message, args) => {
        let channel = message.mentions.channels.first() ||
        message.guild.channels.cache.find(c => c.id == args[1]) ||
        message.guild.channels.cache.find(c => c.name == args[1]);

        if (!checkStaff(message.member)) return message.channel.send('Nope, you\'re not touching this command, not even close');

        try {
            let jsonEmbed = JSON.parse(args.slice(2).join(' '));
            channel.messages.fetch(args[0])
                .then(msg => {
                    msg.edit(jsonEmbed);
                    message.channel.send('Successfully edited embed!');
                });

        } catch (e) {
            const errEmbed = new MessageEmbed()
                .setColor(colors.Red)
                .setTitle('Error')
                .setDescription(e)
                .setFooter(bot.user.username, bot.user.displayAvatarURL);
            
            message.channel.send(errEmbed);
        }
    }
};