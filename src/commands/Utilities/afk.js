const { Message, DiscordAPIError } = require('discord.js');
const Bot = require('../../../index');
const ms = require('ms');

module.exports = {
    name: 'afk',
    aliases: ['away-from-keyboard', 'gn'],
    usage: 'afk (message)',
    description: 'Leave an AFK message that will show whenever you\'re pinged. Also one of Tera\'s favorite commands\nPlease note this will not overwrite your client settings, and there will still be notifications unless disabled',
    cooldown: 20,

    /**
    * @param {Bot} bot
    * @param {Message} message
    * @param {string[]} args
    */
    run: async(bot, message, args) => {
        const { afk } = bot,
            { id, displayName } = message.member,
            timeout = 30000; // ms

        /** Flags that can be toggled anywhere on the command
         * 0 ==> unbreakable
         * 1 ==> don't change nickname
         * @type {boolean[]} */
        const flags = [null, null];
        let inputFlags = args.find(arg => arg.startsWith('-'));

        function nick(type) {
            const n = flags[1];
            const { length } = displayName;
            switch (type) {
                case 1: // Set
                    if (length <= 26 && !n) {
                        message.member.setNickname('[AFK] ' + displayName)
                            .catch(e => {
                                if (!(e instanceof DiscordAPIError)) throw e;
                            });
                    }
                    break;
                case 2: // Remove before
                    if (length <= 26 && !afk.get(id).flags[1]) {
                        message.member.setNickname(displayName.slice(6))
                            .catch(e => {
                                if (!(e instanceof DiscordAPIError)) throw e;
                            });
                    }
                    break;
            }
        }

        // Parse the flags and add them as booleans
        if (inputFlags) {
            inputFlags = inputFlags.slice(1);
            args.splice(args.indexOf(inputFlags), -1);
            if (inputFlags.includes('u')) flags[0] = true;
            if (inputFlags.includes('n')) flags[1] = true;
        }

        // If a member is already on the collection, aka if they toggle the command
        // This is the only AFK removal method when using the -u flag
        if (afk.get(id)) {
            nick(2);
            afk.delete(id);
            //message.member.setNickname(message.member.displayName.slice(6));
            return message.channel.send(`Welcome back, <@!${id}>! Your AFK was removed.`);
        }

        // The object that's added to the bot.afk Collection instance
        const obj = {
            userID: id,
            username: displayName,
            message: args.join(' '), // Fun fact: if there's no args it'll just show the codeblock (p cool)
            date: Date.now(),
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