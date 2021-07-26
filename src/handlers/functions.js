const { Message, Guild, GuildMember, User, MessageEmbed, Permissions: { FLAGS }, MessageComponentInteraction } = require('discord.js');
const Bot = require('../../index');
const chalk = require('chalk');
const { readJSONSync } = require('fs-extra');
const { FireBrick } = require('../../colors.json');
const { jaidenServerID } = require('../../config.json');

/**
* Finds and returns member object by ID, mention, displayName, username or tag (respectively)
* 
* @param {Message} message The Message object to perform actions using message
* @param {string} toFind String that fetches the user (can be mention, id, tag, or displayName)
* @returns {Promise<?GuildMember>}
*/
async function getMember(message, toFind) {
    toFind = toFind.toLowerCase();
    let target;
    // By mention
    target = message.mentions?.members?.first();
    // By cache (ID, displayName, username, tag)
    if (!target) target = message.guild.members.cache.get(toFind);
    if (!target) target = message.guild.members.cache.find(member => {
        return member.displayName.toLowerCase().includes(toFind) ||
        member.user.username.toLowerCase().includes(toFind) ||
        member.user.tag.toLowerCase().includes(toFind);
    });
    // By fetching (if valid user ID)
    if (!target && toFind.length == 18) target = await message.guild.members.fetch(toFind).catch(() => {});
    // By searching nickname / username
    if (!target) target = (await message.guild.members.search({ query: toFind, limit: 1 })).first();
    return target ?? null;
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
 * Makes a buttons collector and returns its interaction
 * @param {Message} message The message that was just sent (NOT the user's command)
 * @param {string} authorID The ID of the person who triggered this command
 * @param {number} time The time in which the collector would be available in seconds
 */
async function promptButtons(message, authorID, time) {
    time *= 1000;

    return await message.awaitMessageComponent({
        filter: i => i.user.id == authorID, time
    }).catch(() => {});
}

/**
* Checking whether a member is staff or not
* 
* @param {GuildMember} member The member to check on
* @returns {Promise<boolean>}
*/
async function checkStaff(member) {
    await member.fetch();
    try {
        if (
            member.roles.cache.find(r => r.name == 'Staff') || // Check by roles
            member.roles.cache.find(r => r.name == 'Helpers') ||
            member.roles.cache.find(r => r.name == 'Moderators') ||
            member.roles.cache.find(r => r.name == 'Administrator') ||
            member.id == member.guild.ownerId || // Check if it's the owner
            member.permissions.has(FLAGS.ADMINISTRATOR) || // Check by perms (honestly these are enough to check for all staff)
            member.permissions.has(FLAGS.KICK_MEMBERS) ||
            member.permissions.has(FLAGS.BAN_MEMBERS) ||
            member.permissions.has(FLAGS.MANAGE_MESSAGES)
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
async function blacklistProcess(message, bot) {
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
        *       ^word$ : only word                                  | "word"
        *       ^word[^a-z]+ word ONLY AT THE START, then symbols   | "word.!+-"
        *       [^a-z]+word$ : symbols, then word ONLY AT THE END   | "-+!word"
        *       [^a-z]+word[^a-z]+: symbols, word, symbols          | "-+!word!+-"
        * @type {RegExp} */  
        // eslint-disable-next-line no-useless-escape
        let pattern = new RegExp(`(^${w}$)|(^${w}[^a-z]+)|([^a-z]+${w}$)|([^a-z]+${w}[^a-z]+)`, 'mi');

        if (Array.isArray(w)) {
            return w.every(v => split.some(e => 
                new RegExp(`(^${v}$)|(^${v}[^a-z]+)|([^a-z]+${v}$)|([^a-z]+${v}[^a-z]+)`, 'mi').test(e)
            ));
        } else {
            return split.some(w => pattern.test(w));
        }
    };
    /**
     * @param {string} msg The message to send
     */
    let act = (msg) => {
        if (blacklistLogs) {
            let embeds = [ new MessageEmbed()
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
                ) ];
            bot.channels.cache.get(logChannel).send({ embeds });
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
        if (await checkStaff(message.member).then()) return;
        act('Please refer to Rule 6, don\'t talk about sensitive topics like Jaiden Rule 34');
    }
}

/**
 * Unhoists one member
 * @param {GuildMember} member 
 */
async function unhoistOne(member) {
    let newNick = member.displayName;
   
    const hoistPattern =  /^[!?$-]+/;

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
async function nicknameProcess(guild) {
    const s = (query) => guild.members.search({ query });
    const members = await Promise.all([
        s('!'),
        s('$'),
        s('-'),
        s('+'),
        s('.'),
        s('#'),
        s('&'),
        s('*'),
        s('/'),
    ]).then(ms => ms.filter(m => m).reduce((a, c) => a.concat(c)));
    if (members.size) members.each(m => { if (m) unhoistOne(m); });
    return members.size;
}

/**
 * Uses the `bot.interactions` Collection to recursively add command data to the main server
 * It also adds staff only permissions if `staffOnly` exists in the interaction object, 
 * or custom permissions through a `permissions` property
 * @param {Bot} bot 
 */
async function publishInteractions(bot) {
    try {
        for (let interaction of bot.interactions.array()) {
            const command = await bot.guilds.cache.get(jaidenServerID).commands.create(interaction.data);

            // a thing to know: add staffOnly AND set data.defaultPermission to false
            if (interaction.staffOnly) command.permissions.add({ permissions: [
                { id: '756585204344291409', type: 'ROLE', permission: true }, // Staff
                { id: '775665978813054986', type: 'ROLE', permission: true }, // Helpers
                { id: '755094113358970900', type: 'ROLE', permission: true }, // Moderators
                { id: '755093779282657342', type: 'ROLE', permission: true }, // Administrators
                { id: '558264504736153600', type: 'USER', permission: true }  // Me
            ]});
            else if (interaction.permissions) command.permissions.add({ permissions: interaction.permissions });
        }
        console.info(chalk.green('[Info]'), 'Commands\' data has been republished');
    } catch (e) {
        console.error(e);
    }  
}

module.exports = {
    getMember,
    formatDate,
    promptButtons,
    checkStaff,
    blacklistProcess,
    unhoistOne,
    nicknameProcess,
    publishInteractions
};