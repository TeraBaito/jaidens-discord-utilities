const { Message, Guild, GuildMember, MessageEmbed, Permissions: { FLAGS }, ButtonInteraction, Collection } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const Bot = require('../../Bot');
const chalk = require('chalk');
const { readJSONSync } = require('fs-extra');
const { FireBrick } = require('../../colors.json');
const { jaidenServerID } = require('../../config.json');
const { disabledInteractions } = require('../../botSettings.json');

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

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
 * Makes a buttons collector and returns its interaction
 * @param {Message} message The message that was just sent (NOT the user's command)
 * @param {string} authorID The ID of the person who triggered this command
 * @param {number} time The time in which the collector would be available in seconds
 * @returns {Promise<ButtonInteraction>}
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
    const commands = []; // command data
    const permissionsMap = new Collection(); // command permissions
    const permissionsPacket = []; // mapped command permissions (w/ IDs)
    
    try {
        // Filters out disabled slash commands
        for (let interaction of [...bot.interactions.filter(({ name }) => !disabledInteractions.includes(name)).values()]) {
            // Pushes the command JSON data to an array for bulk registering
            commands.push(interaction.toJSON());

            if (interaction.extra?.staffOnly) permissionsMap.set(interaction.name, buildPerms([
                '756585204344291409', // Staff
                '775665978813054986', // Helpers
                '755094113358970900', // Moderators
                '755093779282657342' // Administrators
                // and me appended on the function
            ]));
            else if (interaction.extra?.permissions) permissionsMap.set(interaction.name, interaction.extra.permissions);
        }

        // Makes a PUT request to the interactions route with all the commands' data
        await rest.put(
            Routes.applicationGuildCommands(bot.user.id, jaidenServerID),
            { body: commands }
        );
        console.log(chalk.green('[Info]', 'Commands\' data has been republished'));
        
        // Fetches all the commands
        const fetchedCommands = await bot.guilds.cache.get(jaidenServerID).commands.fetch();
        // Merges the command ID (on fetchedCommands) with its respective permissions (on permissionsMap)
        // on another bulk update array
        permissionsMap.each((perms, name) => permissionsPacket.push({ 
            id: fetchedCommands.find(c => c.name == name).id, 
            permissions: perms 
        }));
        
        // Bulk updates the permissions of all commands with the formed packet
        await bot.guilds.cache.get(jaidenServerID).commands.permissions.set({ fullPermissions: permissionsPacket });
        console.log(chalk.green('[Info]', 'Commands\' permissions have been updated'));
    } catch (e) { console.error(e); }

    // Maps an array to the { id, type, permission } format and adds the owner user to it
    function buildPerms(idsArr) {
        idsArr = idsArr.map(p => ({ id: p, type: 'ROLE', permission: true }));
        idsArr.push({ id: '558264504736153600', type: 'USER', permission: true });
        return idsArr;
    }
}

module.exports = {
    getMember,
    promptButtons,
    checkStaff,
    blacklistProcess,
    unhoistOne,
    nicknameProcess,
    publishInteractions
};