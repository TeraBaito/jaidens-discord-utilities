const Discord = require('discord.js');


module.exports = { 
    name: 'ping',
    helpName: 'Ping',
    category: 'Utilities',
    aliases: ['pingu', 'pong'],
    usage: 'ping',
    description: 'Checks the latency of the bot and message latency, and checks if bot is on',

    run: async (bot, message, args) => {

        const msg = await message.channel.send('Pinging...');

        msg.edit(`Pong!\nLatency: ${Math.floor(msg.createdAt - message.createdAt)}ms\nDiscord API Latency: ${bot.ws.ping}ms`);
    }
};