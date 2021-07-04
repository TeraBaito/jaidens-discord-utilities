const { Message } = require('discord.js');
const Bot = require('../../../Bot');

module.exports = {
    name: 'grady',
    hidden: true,
    usage: 'grady',
    description: 'grady',
    /** 
     * @param {Bot} bot 
     * @param {Message} message 
     * @param {string[]} args 
     */
    run: async(bot, message, args) => {
        message.channel.send('<@740491200972193793>');
        message.channel.send('<:7462067385035653531:781950847616548895>');
    }
};