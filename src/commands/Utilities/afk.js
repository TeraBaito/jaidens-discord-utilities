const { red } = require('chalk');
const Discord = require('discord.js');

module.exports = {
    name: 'afk',
    aliases: ['away-from-keyboard', 'gn'],
    usage: 'afk (message)',
    description: 'Leave an AFK message that will show whenever you\'re pinged. Also one of Tera\'s favorite commands\nPlease note this will not overwrite your client settings, and there will still be notifications unless disabled',

    /**
    * @param {Discord.Client} bot
    * @param {Discord.Message} message
    * @param {Array} args
    */
    run: async(bot, message, args) => {
        const { afk } = bot,
            { id, displayName } = message.member;
        const obj = {
            userID: id,
            username: displayName,
            message: args.join(' '),
            date: Date.now()
        };

        setTimeout(() => bot.afk.set(id, obj), 30000);
        message.channel.send('All right! Setting your AFK message in 30 seconds')
            .then(m => setTimeout(() => { m.delete(); message.delete(); }, 7000));
    }
};