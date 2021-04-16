const Discord = require('discord.js');

module.exports = {
    name: 'grady',
    hidden: true,
    usage: 'grady',
    description: 'grady',
    /** 
     * @param {Discord.Client} bot 
     * @param {Discord.Message} message 
     * @param {Array} args 
     */
    run: async(bot, message, args) => {
        message.channel.send('<@740491200972193793>');
        message.channel.send('<:7462067385035653531:781950847616548895>');
    }
};