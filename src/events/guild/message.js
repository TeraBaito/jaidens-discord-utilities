const { Message, DiscordAPIError } = require('discord.js');
const Bot = require('../../../index');
const { prefix, jaidenServerID } = require('../../../config.json');
const { blacklistProcess } = require('../../handlers/functions');
const { readJSONSync } = require('fs-extra');
const autoresponders = require('../../handlers/autoresponders.js');
const ms = require('ms');

let toggleAR = true;

/**
 * `message` event.
 * 
 * Triggers each time any user sends any message in any channel the bot can look into.
 * 
 * This event will include things to do whenever a command is triggered, a blacklisted word is said, etc.
 * 
 * Honestly mostly everything that has to do with user input goes here.
 * 
 * @param {Bot} bot The bot as a Client object
 * @param {Message} message The Message object passed with the `message` event.
 */
module.exports = async (bot, message) => {
    const { disabledCommands, blacklisting, autoresponders: ar } = readJSONSync('./botSettings.json');

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    /* "\config prefix ?" in which:
    \ = prefix
    config = cmd
    prefix,? = args (args[0],args[1]) */

    let allowedServers = [jaidenServerID, '386244779752816640', '711301984887636080', '601434467072212993'];
    

    if (message.channel.type === 'news' && message.embeds.length > 0 && message.guild.id === jaidenServerID) {
        message.crosspost()
            .catch(console.error);
    }

    // Command reading [1]
    if (message.author.bot) return; // Prevent from command loops or maymays from bot answers

    // Blacklisting
    if (blacklisting && 
        (message.guild.id == jaidenServerID ||
        ['717046261487763516', '734543511529193584'].includes(message.channel.id))) blacklistProcess(message, bot);

    // Autoresponders
    if (ar) {
        autoresponders.forEach(elem => {
            const { input, output, regexp } = elem;
            if (regexp) {
                if (input.test(message.content.toLowerCase()) && toggleAR) {
                    message.channel.send(output);
                    // Change the switch, nullifying the autoresponder, and turning it back on after a certain time
                    toggleAR = !toggleAR;
                    setTimeout(() => {
                        toggleAR = !toggleAR;
                    }, 10000);
                }
            } else {
                if (message.content.toLowerCase().includes(input)) {
                    message.channel.send(output);
                    // Change the switch, nullifying the autoresponder, and turning it back on after a certain time
                    toggleAR = !toggleAR;
                    setTimeout(() => {
                        toggleAR = !toggleAR;
                    }, 10000);
                }
                
            }
        });
    }
    
    const data = bot.afk.get(message.author.id);
    // AFK System
    if (data && !data.flags[0]) {
        const { displayName } = message.member;
        const { length } = displayName;
        bot.afk.delete(message.author.id);
        if (displayName.startsWith('[AFK] ') && !data.flags[1]) {
            message.member.setNickname(displayName.slice(6))
                .catch(e => {
                    if (!(e instanceof DiscordAPIError)) throw e;
                });
        }
        message.channel.send(`Welcome back, <@!${message.author.id}>! Your AFK was removed.`)
            .then(m => setTimeout(() => m.delete(), 7000));
    }

    if (message.mentions.members.first()) {
        const afkPull = bot.afk.get(message.mentions.members.first().id);
        if (afkPull) {
            message.channel.send(`\`\`\`${afkPull.username} has been AFK for ${ms(Date.now() - afkPull.date, { long: true })}\`\`\``+
            `${afkPull.message}`);
        }
    }
    

    // Command reading [2]
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
