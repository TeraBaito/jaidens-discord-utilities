const Discord = require('discord.js');
const chalk = require('chalk');
const { readJSONSync } = require('fs-extra');

/**
* Finds and returns member object by ID, mention, displayName, username or tag (respectively)
* 
* @param {Discord.Message} message The Message object to perform actions using message
* @param {string} toFind String that fetches the user (can be mention, id, tag, or displayName)
* @returns {Discord.GuildMember}
*/
function getMember(message, toFind) {
    toFind = toFind.toLowerCase();

    // First, tries to get from ID (all members should work, since bot has fetchAllMembers: true)
    let target = message.guild.members.cache.get(toFind);

    // Then, tries to get from mention
    if (!target && message.mentions.members) target = message.mentions.members.first();

    // Then, tries getting from tag or displayName
    if(!target && toFind)
        target = message.guild.members.cache.find(member => {
            // Then, tries to get from displayName (nickname -> username)
            return member.displayName.toLowerCase().includes(toFind) ||
                // Then, solely for username (this is so that a nickname doesn't overwrite a username when used)
                member.user.username.toLowerCase().includes(toFind) ||
                // Then, tries getting it for mention
                member.user.tag.toLowerCase().includes(toFind);
        });

    // If none of those work, it uses the GuildMember from who sent a message that triggered this function
    if(!target)
        target = message.member;

    return target;
}

/**
* Formats a given Date() to be shown in en-US format with "Weekday, Month D, YYYY, HH:MM:SS" display
* 
* @param {Date} date 
* @returns {string}
* 
*/
function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    }).format(date);
}

/**
* Sends a message (prompt) with X reactions, the bot will take action depending on the chosen reaction.
* 
* @param {Discord.Message} message The Message object to perform actions using message
* @param {Discord.User|Discord.GuildMember} author The author of the message, so that actions only perform based on theirs
* @param {Number} time Prompt message expiration time in seconds
* @param {Array} validReactions Array with reactions the bot will listen to
*/
async function promptMessage(message, author, time, validReactions) {
    time *= 1000;

    for(const reaction of validReactions) await message.react(reaction);

    const filter = (reaction, user) => validReactions.includes(reaction.emoji.name) && user.id === author.id;

    return message
        .awaitReactions(filter, { max: 1, time: time})
        .then(collected => collected.first() && collected.first().emoji.name);
}

/**
* Gives a random number between 0 and number parameter, use Math.floor(randomizePercentage()) to get a natural number.
* 
* @param {number} number Max number to randomize
* @returns {number}
*/
function randomizePercentage(number) {
    return Math.random() * number;
}

/**
* Checking whether a member is staff or not
* 
* @param {Discord.GuildMember} member The member to check on
* @returns {boolean}
*/
function checkStaff(member) {
    try {
        if (
            member.roles.cache.find(r => r.name == 'Staff') || // Check by roles
            member.roles.cache.find(r => r.name == 'Helpers') ||
            member.roles.cache.find(r => r.name == 'Moderators') ||
            member.roles.cache.find(r => r.name == 'Administrator') ||
            member.id == member.guild.ownerID || // Check if it's the owner
            member.hasPermission('ADMINISTRATOR') || // Check by perms (honestly these are enough to check for all staff)
            member.hasPermission('KICK_MEMBERS') ||
            member.hasPermission('BAN_MEMBERS') ||
            member.hasPermission('MANAGE_MESSAGES')
        ) return true;
        return false;
    } catch (e) {
        if (e instanceof TypeError) return;
        console.error(chalk.redBright('[Error]'), e.name);
    }
}

/**
* Blacklisting words process
* 
* Actions it takes: deletes the message and calls out a rule name for the specific type of word
* @param {Discord.Message} message The Message object to perform actions using message
*/
function blacklistProcess(message) {
    const { nsfw, offensive, jr34 } = readJSONSync('./src/handlers/blacklisted-words.json');

    const mention = `<@!${message.author.id}>`;
    let { content } = message;

    content = content.toLowerCase();

    /**
     * @param {String} w The word
     * @returns {Boolean}
     */
    let process = (w) => 
        content.includes(' ' + w + ' ') ||
        content.endsWith(' ' + w) || 
        content.startsWith(w + ' ') ||
        content == w;
    
    /**
     * @param {String} msg The message to send
     * @returns {void}
     */
    let act = (msg) => {
        if (message.deletable) message.delete();
        message.channel.send(`${mention}, ${msg}`)
            .then(m => setTimeout(() => m.delete(), 10000));
    };

    // NSFW words
    if (nsfw.some(process)) {
        act('Please refer to Rule 3, don\'t engage in NSFW conversations on this server');
    }

    // Offensive words
    if(offensive.some(process)) {
        act('Please refer to Rule 1 and 9, really offensive words are discouraged in this server');
    }

    // "jr34"
    if (jr34.some(process)) {
        if (checkStaff(message.member)) return;
        act('Please refer to Rule 6, don\'t talk about sensitive topics like Jaiden Rule 34');
    }
}

module.exports = {getMember, formatDate, promptMessage, randomizePercentage, checkStaff, blacklistProcess};