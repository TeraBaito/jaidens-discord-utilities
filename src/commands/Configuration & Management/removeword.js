const beautify = require('beautify');
const Discord = require('discord.js');
const { checkStaff } = require('../../handlers/functions');

module.exports = {
    name: 'removeword',
    helpName: 'Remove Blacklisted Word',
    category: 'Configuration & Management',
    aliases: ['delword', 'remove-word', 'rmword', 'remove-blacklist'],
    usage: 'removeword [{nsfw, offensive}] [word]',
    description: 'ADMIN COMMAND ONLY\nRemoves a blacklisted word from the word list',

    /**
    * @param {Discord.Client} bot
    * @param {Discord.Message} message
    * @param {Array} args
    */
    run: async(bot, message, args) => {
        if (!checkStaff(message.member)) return message.channel.send('Sorry, you can\'t access this command!');
        if (!args[0] || !args[1]) return message.channel.send('Please input the valid syntax from the help command!');

        /** @type {{nsfw: string[], offensive: string[], jr34: string}} */
        const words = JSON.parse(fs.readFileSync('./src/handlers/blacklisted-words.json', 'utf-8'));
        const { offensive, nsfw } = words;
        
        
        switch(args[0]) {
        case 'offensive':
            if (!offensive.find(args[1])) return message.channel.send('There\'s no such word as that!');
            offensive.splice(offensive.indexOf(args[1]), 1);
            message.channel.send('Deleted the word from the offensive words list');
            break;
        case 'nsfw':
            if (!nsfw.find(args[0])) return message.channel.send('There\'s no such word as that!');
            nsfw.splice(nsfw.indexOf(args[1]), 1);
            message.channel.send('Deleted the word from the NSFW words list');
            break;
        default:
            return message.channel.send('Invalid word type given! Please check the types in the help command');
        }
        fs.writeFileSync('./src/handlers/blacklisted-words.json', beautify(JSON.stringify(words), { format: 'json' }));
    }
};