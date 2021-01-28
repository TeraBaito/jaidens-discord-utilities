const Discord = require('discord.js');
const { nicknameProcess } = require('../../handlers/functions');

module.exports = {
    name: 'unhoist',
    helpName: 'Member Nickname Unhoisting',
    category: 'Configuration & Management',
    aliases: [],
    usage: 'unhoist',
    description: 'MOD COMMAND ONLY\nUnhoists all hoisted members by a RegExp pattern.',

    /**
    * @param {Discord.Client} bot
    * @param {Discord.Message} message
    * @param {Array} args
    */
    run: async(bot, message, args) => {
        const count = nicknameProcess(message.guild);
        if (!count) return message.channel.send('There wasn\'t anyone to remove the hoisting to <:AkaneShrug:774128813037715506>');
        message.channel.send(`Successfully removed nickname hoisting from \`${count}\` members.`);
    }
};