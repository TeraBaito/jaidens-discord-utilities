const Interaction = require('../../../Interaction');
const { MessageEmbed } = require('discord.js');
const { evaluate } = require('mathjs');
const colors = require('../../../colors.json');

module.exports = new Interaction((bot, interaction) => {
    let resp;
    try { resp = evaluate(interaction.options.get('operation').value); }
    catch (e) { return interaction.reply({ content: 'Please ask a valid math question.', ephemeral: true }); }

    const embeds = [ new MessageEmbed()
        .setColor(colors.Blue)
        .setTitle('Math')
        .addField('Question', `\`\`\`css\n${interaction.options.get('operation').value}\`\`\``)
        .addField('Answer', `\`\`\`css\n${resp}\`\`\``) ];
    
    interaction.reply({ embeds });
})
    .setName('math')
    .setDescription('Evaluates a math operation. Please no derivates or something lol')
    .addStringOption(str => str
        .setName('operation')
        .setDescription('The operation to evaluate')
        .setRequired(true)
    );
