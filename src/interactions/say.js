const { Constants: { ChannelTypes: { GUILD_TEXT } } } = require('discord.js');
const Interaction = require('../../Interaction');

module.exports = new Interaction((bot, interaction) => {
    const { channel } = interaction.options.get('channel');
    const { value: text } = interaction.options.get('text');
    
    channel.send(text);
    interaction.reply({ content: 'Message has been sent successfully', ephemeral: true });
}, { staffOnly: true })
    .setName('say')
    .setDescription('STAFF ONLY | Echoes the given args to a specified channel')
    .addChannelOption(ch => ch
        .setName('channel')
        .setDescription('The channel to output the message')
        .addChannelType(GUILD_TEXT)
        .setRequired(true)
    )
    .addStringOption(str => str
        .setName('text')
        .setDescription('The message\'s text to send')
        .setRequired(true)
    );