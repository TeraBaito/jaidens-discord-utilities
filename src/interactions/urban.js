const Interaction = require('../../Interaction');
const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');
const chalk = require('chalk');
const colors = require('../../colors.json');

module.exports = new Interaction(async (bot, interaction) => {
    const query = new URLSearchParams({ term: interaction.options.get('term').value });
    const url = 'https://api.urbandictionary.com/v0/define?' + query;

    try {
        const { list } = await fetch(url).then(r => r.json());
        if (!list.length) return interaction.reply({ content: `Didn't find any results for \`${interaction.options.get('term').value }\``, ephemeral: true });
        const { author, word, permalink, definition, example } = list[0];

        const embeds = [ new MessageEmbed()
            .setColor(colors.Peru)
            .setTitle(word)
            .setURL(permalink)
            .addField('Definition', definition)
            .setFooter(`By ${author}`) ];
        if (example) embeds[0].addField('Example', example);

        interaction.reply({ embeds });
    } catch (e) {
        interaction.reply({ content: 'Something went wrong...', ephemeral: true });
        console.error(`${chalk.redBright('[Error]')} - ${e.stack}`);
    }
})
    .setName('urban')
    .setDescription('Defines a term using the Urban Dictionary API')
    .addStringOption(str => str
        .setName('term')
        .setDescription('The term to query')
        .setRequired(true)
    );