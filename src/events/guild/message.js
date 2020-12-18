const Discord = require('discord.js');
const { prefix } = require('../../../config.json');
const { blacklistProcess } = require('../../handlers/functions');

/**
 * `message` event.
 * 
 * Triggers each time any user sends any message in any channel the bot can look into.
 * 
 * This event will include things to do whenever a command is triggered, a blacklisted word is said, etc.
 * 
 * Honestly mostly everything that has to do with user input goes here.
 * 
 * @param {Discord.Client} bot The bot as a Client object
 * @param {Discord.Message} message The Message object passed with the `message` event.
 */
module.exports = async (bot, message) => {
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    /* "\config prefix ?" in which:
    \ = prefix
    config = cmd
    prefix,? = args (args[0],args[1]) */

    let allowedServers = ['386244779752816640', '711301984887636080', '754451472699228281'];
    

    if (message.channel.type === 'news') {
        message.crosspost()
            .catch(console.error);
    }

    blacklistProcess(message);

    // command reading
    if (message.author.bot) return; // Prevent from command loops or maymays from bot answers
    if (!message.guild) return; // No DMs n stuff
    if (!allowedServers.includes(message.guild.id)) return; 
    if (!message.member) message.member = await message.guild.members.fetch(message);
    if (cmd.length === 0) return; // Come on

    // Command handler
    let command = bot.commands.get(cmd);
    if(!command) command = bot.commands.get(bot.aliases.get(cmd));
    if(command && message.content.startsWith(prefix)) command.run(bot, message, args);
};