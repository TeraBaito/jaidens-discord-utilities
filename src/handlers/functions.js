const { Message, Guild, GuildMember, User, MessageEmbed } = require('discord.js');
const Bot = require('../../index');
const chalk = require('chalk');
const { readJSONSync } = require('fs-extra');
const { FireBrick } = require('../../colors.json');

/**
* Finds and returns member object by ID, mention, displayName, username or tag (respectively)
* 
* @param {Message} message The Message object to perform actions using message
* @param {string} toFind String that fetches the user (can be mention, id, tag, or displayName)
* @returns {GuildMember}
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
* @param {Message} message The Message object to perform actions using message
* @param {User|GuildMember} author The author of the message, so that actions only perform based on theirs
* @param {Number} time Prompt message expiration time in seconds
* @param {Array} validReactions Array with reactions the bot will listen to
*/
async function promptMessage(message, author, time, ...validReactions) {
    time *= 1000;

    for(const reaction of validReactions) {
        message.react(reaction);
        // eslint-disable-next-line no-inner-declarations
        const d = async () => new Promise(r => setTimeout(r, 1000));
        await d();
    }

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
* @param {GuildMember} member The member to check on
* @returns {boolean}
*/
async function checkStaff(member) {
    await member.fetch();
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
* You can't make everyone happy with what is here
* @param {Message} message The Message object to perform actions using message
* @param {Bot} bot The Client object
*/
function blacklistProcess(message, bot) {
    const { nsfw, offensive, jr34 } = readJSONSync('./src/handlers/blacklisted-words.json'),
        { blacklistLogs } = readJSONSync('./botSettings.json'),
        { logChannel } = require('../../config.json');

    const mention = `<@!${message.author.id}>`;
    let { content } = message;

    content = content.toLowerCase();

    /**
    * @param {string} w The word
    * @returns {boolean}
    */
    let process = (w) => {
        const split = message.content.split(/ +/g);
        /** Blacklist pattern
        * Breakdown:
        *      ^word$ : only word
        *      |([^a-z\s]+word) : anything that's not a-z or whitespace, then word
        *      |(word[^a-z\s]+) : the same but backwards
        * @type {RegExp} */  
        // eslint-disable-next-line no-useless-escape
        let pattern = new RegExp(`(^${w}$)|([^a-z\s]+${w})|(${w}[^a-z\s]+)`, 'mi');

        if (Array.isArray(w)) {
            return w.every(e => {
                // eslint-disable-next-line no-useless-escape
                let pattern = new RegExp(`(^${e}$)|([^a-z\s]+${e})|(${e}[^a-z\s]+)`, 'mi');
                return pattern.test(e);
            });
            // return pattern.test(message.content);
        } else {
            return split.some(w => pattern.test(w));
        }
    };
    /**
     * @param {string} msg The message to send
     */
    let act = (msg) => {
        if (blacklistLogs) {
            let embed = new MessageEmbed()
                .setColor(FireBrick) 
                .setTitle('Blacklisting')
                .addFields(
                    {
                        name: 'Offender',
                        value: message.author.tag,
                        inline: true
                    },
                    {
                        name: 'ID',
                        value: message.author.id,
                        inline: true
                    },
                    {
                        name: 'Original Message',
                        value: message.content,
                        inline: false
                    }
                );
            bot.channels.cache.get(logChannel).send(embed);
        }
        
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
        act('Please refer to Rule 1, really offensive words are discouraged in this server');
    }

    // "jr34"
    if (jr34.some(process)) {
        if (checkStaff(message.member)) return;
        act('Please refer to Rule 6, don\'t talk about sensitive topics like Jaiden Rule 34');
    }
}

/**
 * Unhoists one member
 * @param {GuildMember} member 
 */
function unhoistOne(member) {
    let newNick = member.displayName;
   
    const hoistPattern =  /^[!-/]/;

    // While the nickname matches the RegExp, slice 1 char and trim
    while(hoistPattern.test(newNick)) {
        newNick = newNick.slice(1).trim();
    }

    // Default to generic nick if recursing removes the whole string
    // aka the user is called something like "!!"
    if (newNick == '') newNick = 'non-hoistable nickname';

    // Only change if the newNick was changed (to prevent unnecessary nick changes)
    if (member.displayName != newNick) member.setNickname(newNick);
}

/**
 * Calls unhoistOne() on a collection of members
 * @param {Guild} guild 
 */
function nicknameProcess(guild) {
    const hoistPattern =  /^[!-/]/;
    const members = guild.members.cache.filter(m => hoistPattern.test(m.displayName));
    //console.log(members);
    members.each(m => unhoistOne(m));
    return members.size;
}

module.exports = {
    getMember,
    formatDate,
    promptMessage,
    randomizePercentage,
    checkStaff,
    blacklistProcess,
    unhoistOne,
    nicknameProcess
};
