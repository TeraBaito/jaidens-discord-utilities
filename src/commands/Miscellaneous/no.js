const Discord = require('discord.js');

module.exports = {
    name: 'no',
    helpName: 'No, Jaiden is Not Here',
    category: 'Miscellaneous',
    aliases: [],
    usage: 'no',
    description: 'You can still stay for the community however!',

    /** 
     * @param {Discord.Client} bot 
     * @param {Discord.Message} message 
     * @param {Array} args 
     */
    run: async(bot, message, args) => {
        if (message.deletable) message.delete();
        message.channel.send('Unfortunately, Jaiden is not on this server, nor does she own any public server. However, this is the largest non-official fan server on Discord and you\'re welcome to stay!');
    }
};