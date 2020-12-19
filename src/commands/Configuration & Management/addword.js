const Discord = require('discord.js');
const fs = require('fs');
const { checkStaff } = require('../../handlers/functions');
const beautify = require('beautify');


module.exports = {
    name: 'addword',
    helpName: 'Add Blacklisted Word',
    category: 'Configuration & Management',
    aliases: ['add-word', 'add-blacklist'],
    usage: 'addword [{nsfw, offensive}] [word]',
    description: 'ADMIN COMMAND ONLY\nAdds a blacklisted word to the word list',

    /**
    * @param {Discord.Client} bot
    * @param {Discord.Message} message
    * @param {Array} args
    */
    run: async(bot, message, args) => {
        if (!checkStaff(message.member)) return message.channel.send('Sorry, you can\'t access this command!');

        /** @type {{nsfw: string[], offensive: string[], jr34: string}} */
        const words = JSON.parse(fs.readFileSync('./src/handlers/blacklisted-words.json', 'utf-8'));

        /**
         * Person#say
         */
        switch(args[0]) {
        case 'offensive':
            words.offensive.push(args[1]);
            message.channel.send('Added the word to the offensive words list');
            break;
        case 'nsfw':
            words.nsfw.push(args[1]);
            message.channel.send('Added the word to the NSFW words list');
            break;
        default:
            return message.channel.send('Invalid word type given! Please check the types in the help command');
        }
        fs.writeFileSync('./src/handlers/blacklisted-words.json', beautify(JSON.stringify(words), { format:'json' }));
    }
};