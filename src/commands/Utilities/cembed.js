const Discord = require('discord.js');
const colors = require('../../../colors.json');
const { checkStaff } = require('../../handlers/functions');

module.exports = {
    name: 'cembed',
    aliases: ['jsonembed'],
    usage: 'cembed [channel] [json-embed]',
    description: 'Sends an embed using JSON format to the specified channel',

    /** 
     * @param {Discord.Client} bot 
     * @param {Discord.Message} message 
     * @param {Array} args 
     */
    run: async (bot, message, args) => {
        let channel = message.mentions.channels.first() ||
        message.guild.channels.cache.find(c => c.id == args[0]) ||
        message.guild.channels.cache.find(c => c.name == args[0]);
        
        if (!checkStaff(message.member)) return message.channel.send('Nope, you\'re not touching this command, not even close');

        try {
            let jsonEmbed = JSON.parse(args.slice(1).join(' '));
            channel.send(jsonEmbed);

            message.channel.send('Successfully sent embed!');
        } catch (e) {
            const errEmbed = new Discord.MessageEmbed()
                .setColor(colors.Red)
                .setTitle('Error')
                .setDescription(e)
                .setFooter(bot.user.username, bot.user.displayAvatarURL);
            
            message.channel.send(errEmbed);
        }
    }
};