const Discord = require('discord.js');

module.exports = async(bot, message) => {
    let prefix = process.env.PREFIX;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    /* "\config prefix ?" in which:
    \ = prefix
    config = cmd
    prefix,? = args (args[0],args[1]) */

    let allowedServers = ['386244779752816640', '711301984887636080'];
    // command reading
    if (message.author.bot) return; // Prevent from command loops or maymays from bot answers
    if (!message.guild) return; // No DMs n stuff
    if (!allowedServers.includes(message.guild.id)) return; 
    if (!message.content.startsWith(prefix)) return;
    if (!message.member) message.member = await message.guild.members.fetch(message);
    if (cmd.length === 0) return; // Come on


    // Few commands (think i won't need command handler for these tbh)
    if (message.content === `${prefix}ping`) {
        const msg = await message.channel.send('Pinging...');

        msg.edit(`Pong!\nLatency: ${Math.floor(msg.createdAt - message.createdAt)}ms\nAPI Latency (Bot): ${bot.ws.ping}ms`);

    } // Ping command
};