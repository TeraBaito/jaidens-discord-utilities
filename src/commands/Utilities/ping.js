const { Message } = require('discord.js');
const Bot = require('../../../index');
const { stripIndents } = require('common-tags');


module.exports = { 
    name: 'ping',
    aliases: ['pingu', 'pong'],
    usage: 'ping',
    description: 'Checks the latency of the bot and message latency, and checks if bot is on',

    /** 
     * @param {Bot} bot 
     * @param {Message} message 
     * @param {string[]} args 
     */
    run: async (bot, message, args) => {

        const msg = await message.channel.send('Pinging...');

        msg.edit(stripIndents`Pong!
        Latency: ${Math.floor(msg.createdAt - message.createdAt)}ms
        Discord API Latency: ${bot.ws.ping}ms`);
    }
};