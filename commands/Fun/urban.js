const Discord = require('discord.js'),
    fetch = require('node-fetch'),
    querystring = require('querystring'),
    chalk = require('chalk'),
    colors = require('../../colors.json');


module.exports = {
    name: 'urban',
    helpName: 'Urban Dictionary',
    category: 'Fun',
    // aliases: [],
    usage: 'urban [term]',
    description: 'Defines a term using the Urban Dictionary API',
    run: async(bot, message, args) => {
        if (!args[0]) return message.channel.send('Please provide a term tho');

        const msg = await message.channel.send('Searching...');

        const query = querystring.stringify({ term: args.join(' ') });
        const url = `https://api.urbandictionary.com/v0/define?${query}`;

        try {
            const { list } = await fetch(url).then(r => r.json());
            const { author, word, permalink, definition, example} = list[0];
            if (!list.length) return message.channel.send(`Didn't find any results for \`${args.join(' ')}\``);

            const embed = new Discord.MessageEmbed()
                .setColor(colors.Peru)
                .setTitle(word)
                .setURL(permalink)
                .addField('Definition', definition)
                .setFooter(`By ${author}`);
            if (example) embed.addField('Example', example);
            message.channel.send(embed);
            msg.delete();
        } catch (e) {
            message.channel.send('Something went wrong...');
            console.error(`${chalk.redBright('[Error]')} - ${e.stack}`);
        }
        
    }
};