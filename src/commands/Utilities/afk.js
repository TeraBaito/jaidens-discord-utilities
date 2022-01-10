const { Message, DiscordAPIError } = require('discord.js');
const Bot = require('../../../Bot');
const ms = require('ms');

module.exports = {
    name: 'afk',
    aliases: ['away-from-keyboard', 'gn'],
    usage: 'afk (flags) (message)',
    description: `Leave an AFK message that will show whenever you're pinged. Also one of Tera's favorite commands.
Please note this will not overwrite your client settings, and there will still be notifications unless disabled.
**Flags:**
\`-u\`: Unbreakable AFK (you can only remove it by using the afk command again)
\`-n\`: Don't add [AFK] to your nickname
You can concat the flags (e.g. \`a+afk -un funny\`)`,
    cooldown: 20,

    /**
    * @param {Bot} bot
    * @param {Message} message
    * @param {string[]} args
    */
    run: async(bot, message, args) => {
        const { afk } = bot,
            { id, displayName, guild: {id: guild} } = message.member,
            timeout = 30000; // ms

        /** Flags that can be toggled anywhere on the command
         * u ==> unbreakable
         * n ==> don't change nickname
         */
        const flags = {
            u: false,
            n: false
        };
        
        let inputFlags = args.find(arg => arg.startsWith('-'));

        // Parse the flags and add them as booleans
        if (inputFlags) {
            args.splice(args.indexOf(inputFlags), 1);
            inputFlags = inputFlags.slice(1).split('');
            for (let flag of inputFlags) flags[flag] = true;
        }
        
        function nick(type) {
            const { length } = displayName;
            switch (type) {
                case 1: // Set
                    if (length <= 26 && !flags.n) {
                        message.member.setNickname('[AFK] ' + displayName)
                            .catch(e => {
                                if (!(e instanceof DiscordAPIError)) throw e;
                            });
                    }
                    break;
                case 2: { // Remove before
                    const data = afk.get(id);
                    bot.guilds.cache.get(data.guild).members.fetch(data.userID).then(m => {
                        if (m.displayName.length <= 26 && !data.flags.n) {
                            m.setNickname(m.displayName.slice(6))
                                .catch(e => {
                                    if (!(e instanceof DiscordAPIError)) throw e;
                                });
                        }
                    });
                    break;
                }
            }
        }

        // If a member is already on the collection, aka if they toggle the command
        // This is the only AFK removal method when using the -u flag
        if (afk.get(id)) {
            nick(2);
            afk.delete(id);
            return message.channel.send(`Welcome back, <@!${id}>! Your AFK was removed.`);
        }

        // The object that's added to the bot.afk Collection instance
        const obj = {
            userID: id,
            username: displayName,
            message: args.join(' '), // Fun fact: if there's no args it'll just show the codeblock (p cool)
            date: Date.now(),
            guild,
            flags: flags
        };
        
        // 30s timeout
        setTimeout(() => {
            // Sets all the data to the member ID as key
            afk.set(id, obj);
            // [AFK] display name, only if it doesn't surpass the chars limit
            nick(1);
        }, timeout);
        // Sends an auto-delete message
        message.channel.send(`All right! Setting your AFK message in ${ms(timeout, { long: true })}`)
            .then(m => setTimeout(() => { m.delete(); message.delete(); }, 7000));
    }
};