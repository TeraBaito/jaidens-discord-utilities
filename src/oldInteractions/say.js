const { CommandInteraction } = require('discord.js');
const Bot = require('../../Bot');

module.exports = {
    data: {
        name: 'say',
        description: 'STAFF ONLY. Echoes the given args',
        options: [{
            name: 'input',
            type: 'STRING',
            description: 'The input that should be echoed back',
            required: true
        }],
        defaultPermission: false
    },
    staffOnly: true,

    /**
     * @param {Bot} bot 
     * @param {CommandInteraction} interaction 
     */
    run: async (bot, interaction) => {
        const { value: input } = interaction.options.get('input');
        interaction.reply(input);
    }
};