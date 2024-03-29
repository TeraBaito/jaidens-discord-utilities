const { Message, MessageEmbed } = require('discord.js');
const Bot = require('../../../Bot');
const fetch = require('node-fetch');
const chalk = require('chalk');
const colors = require('../../../colors.json');


module.exports = {
    name: 'urban',
    helpName: 'Urban Dictionary',
    usage: 'urban [term]',
    description: 'Defines a term using the Urban Dictionary API',
    cooldown: 7,
    
    /** 
     * @param {Bot} bot 
     * @param {Message} message 
     * @param {string[]} args 
     */
    run: async(bot, message, args) => {
        if (!args[0]) return message.channel.send('Please provide a term tho');

        const msg = await message.channel.send('Searching...');
        
        const query = new URLSearchParams({ term: args.join(' ') });
        const url = 'https://api.urbandictionary.com/v0/define?' + query;

        try {
            const { list } = await fetch(url).then(r => r.json());
            if (!list.length) return message.channel.send(`Didn't find any results for \`${args.join(' ')}\``);
            const { author, word, permalink, definition, example } = list[0];

            const embeds = [ new MessageEmbed()
                .setColor(colors.Peru)
                .setTitle(word)
                .setURL(permalink)
                .addField('Definition', definition)
                .setFooter(`By ${author}`) ];
            if (example) embeds[0].addField('Example', example);

            message.channel.send({ embeds });
            msg.delete();
        } catch (e) {
            message.channel.send('Something went wrong...');
            console.error(`${chalk.redBright('[Error]')} - ${e.stack}`);
        }
    }
};