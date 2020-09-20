/**
 * `message` event
 * Triggers each time any user sends any message in any channel the bot can look into
 * This event will include things to do whenever a command is triggered, a blacklisted word is said, etc.
 * Honestly mostly everything that has to do with user input goes here
 */

const Discord = require('discord.js');
const fs = require('fs');
const { words } = require('../../handlers/blacklisted-words');
const { blacklistProcess } = require('../../handlers/functions');

module.exports = async(bot, message) => {
    let prefix = process.env.PREFIX;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    /* "\config prefix ?" in which:
    \ = prefix
    config = cmd
    prefix,? = args (args[0],args[1]) */

    let allowedServers = ['386244779752816640', '711301984887636080', '754451472699228281'];

    console.log(words.some(word => message.content.includes(word)));
    // command reading
    if (message.author.bot) return; // Prevent from command loops or maymays from bot answers
    if (!message.guild) return; // No DMs n stuff
    if (!message.content.startsWith(prefix) || words.some(word => message.content.includes(word))) return; 

    if (!allowedServers.includes(message.guild.id)) return; 
    if (!message.member) message.member = await message.guild.members.fetch(message);
    if (cmd.length === 0) return; // Come on

    // Command handler
    let command = bot.commands.get(cmd);
    if(!command) command = bot.commands.get(bot.aliases.get(cmd));
    if(command) command.run(bot, message, args);

    blacklistProcess(bot, message);
};