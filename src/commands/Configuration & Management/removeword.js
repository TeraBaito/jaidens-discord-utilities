const { Message } = require('discord.js');
const Bot = require('../../../index');
const { readJSONSync, writeJSONSync } = require('fs-extra');


module.exports = {
    name: 'removeword',
    helpName: 'Remove Blacklisted Word',
    aliases: ['delword', 'remove-word', 'rmword', 'remove-blacklist'],
    usage: 'removeword [{nsfw, offensive}] [word]',
    description: 'ADMIN COMMAND ONLY\nRemoves a blacklisted word from the word list',
    staffOnly: true,

    /**
    * @param {Bot} bot
    * @param {Message} message
    * @param {string[]} args
    */
    run: async(bot, message, args) => {
        if (!args[0] || !args[1]) return message.channel.send('Please input the valid syntax from the help command!');

        /** @type {{nsfw: string[], offensive: string[], jr34: string}} */
        const words = readJSONSync('./src/handlers/blacklisted-words.json', 'utf-8');
        let { offensive, nsfw } = words;
        const { raw: r } = String;

        /** @param {string} i */
        const regex = (i) => i.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
        let inp = args.slice(1);
        inp.length > 1 ? inp = regex(inp) : inp = inp.map(i => regex(i));

        switch(args[0]) {
            case 'offensive':
                if (!offensive.includes(inp)) return message.channel.send('There\'s no such word as that!');
                offensive.splice(offensive.indexOf(inp), 1);
                await message.channel.send('Deleted the word from the offensive words list');
                break;
            case 'nsfw':
                if (!nsfw.includes(inp)) return message.channel.send('There\'s no such word as that!');
                nsfw.splice(nsfw.indexOf(inp), 1);
                await message.channel.send('Deleted the word from the NSFW words list');
                break;
            default:
                return message.channel.send('Invalid word type given! Please check the types in the help command');
        }
        writeJSONSync('./src/handlers/blacklisted-words.json', words, { spaces:4 });
    }
};