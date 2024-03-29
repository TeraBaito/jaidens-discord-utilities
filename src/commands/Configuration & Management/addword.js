const { Message } = require('discord.js');
const Bot = require('../../../Bot');
const { readJSONSync, writeJSONSync } = require('fs-extra');


module.exports = {
    name: 'addword',
    helpName: 'Add Blacklisted Word',
    aliases: ['add-word', 'add-blacklist'],
    usage: 'addword [{nsfw, offensive}] [word]',
    description: 'Adds a blacklisted word to the word list',
    staffOnly: true,

    /**
    * @param {Bot} bot
    * @param {Message} message
    * @param {string[]} args
    */
    run: async(bot, message, args) => {
        if (!args[1]) return message.channel.send('Please input the valid syntax from the help command!');

        /** @type {{nsfw: string[], offensive: string[], jr34: string}} */
        const words = readJSONSync('./src/handlers/blacklisted-words.json', 'utf-8');

        // Automatically escape
        /** @param {string} i */
        const regex = (i) => i.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
        let inp = args.slice(1);
        inp.length > 1 ? inp = inp.map(i => regex(i)) : inp = regex(inp[0]);

        switch(args[0]) {
            case 'offensive':
                if (words.nsfw.includes(inp)) return message.channel.send('The word is in the NSFW words list already!');
                if (words.offensive.includes(inp)) return message.channel.send('The word is already in this list!');

                words.offensive.push(inp);
                message.channel.send('Added the word to the offensive words list');
                break;
            case 'nsfw':
                if (words.offensive.includes(inp)) return message.channel.send('The word is in the offensive words list already!');
                if (words.nsfw.includes(inp)) return message.channel.send('The word is already in this list!');
            
                words.nsfw.push(inp);
                message.channel.send('Added the word to the NSFW words list');
                break;
            default:
                return message.channel.send('Invalid word type given! Please check the types in the help command');
        }
        writeJSONSync('./src/handlers/blacklisted-words.json', words, { spaces:4 });
    }
};