const Discord = require('discord.js');
const { prefix, jaidenServerID } = require('../../../config.json');
const { blacklistProcess } = require('../../handlers/functions');
const { disabledCommands, blacklisting } = require('../../../botSettings.json');

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

    let allowedServers = [jaidenServerID, '386244779752816640', '711301984887636080', '601434467072212993'];
    

    if (message.channel.type === 'news' && message.guild.id === jaidenServerID) {
        message.crosspost()
            .catch(console.error);
    }

    if (blacklisting && 
        (message.guild.id == jaidenServerID ||
        ['717046261487763516', '734543511529193584'].includes(message.channel.id))) blacklistProcess(message);

    // command reading
    if (message.author.bot) return; // Prevent from command loops or maymays from bot answers
    if (!message.guild) return; // No DMs n stuff
    if (!message.member) message.member = await message.guild.members.fetch(message);
    if (cmd.length === 0) return; // Come on

    // Command handler
    let command = bot.commands.get(cmd);
    if(!command) command = bot.commands.get(bot.aliases.get(cmd));
    if(command && message.content.startsWith(prefix)) {
        if (!allowedServers.includes(message.guild.id)) return message.channel.send('Sorry, this bot is private and this server is not included in the allowed servers list.');
        if (disabledCommands.includes(command.name)) return message.channel.send('Sorry, this command is temporarily disabled. Want some choccy milk instead?', { files: ['https://media.discordapp.net/attachments/601435709261348895/801884062226186310/iu.png?width=461&height=473']});
        command.run(bot, message, args);
    }
};