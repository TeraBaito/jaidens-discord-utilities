const { Message } = require('discord.js');
const Bot = require('../../../index');

module.exports = {
    name: 'no',
    helpName: '"No, Jaiden is Not Here"',
    usage: 'no',
    description: 'You can still stay for the community however!',

    /** 
     * @param {Bot} bot 
     * @param {Message} message 
     * @param {string[]} args 
     */
    run: async(bot, message, args) => {
        if (message.deletable) message.delete();
        message.channel.send('Unfortunately, Jaiden is not on this server, nor does she own any public server. However, this is the largest non-official fan server on Discord and you\'re welcome to stay!');
    }
};