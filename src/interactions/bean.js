const { CommandInteraction } = require('discord.js');
const Bot = require('../../Bot');

module.exports = {
    data: {
        name: 'bean',
        description: 'Bean a user, you have to try it and see',
        options: [{
            name: 'user',
            description: 'The user you\'ll throw beans at',
            type: 'USER',
            required: false
        }]
    },

    /**
     * @param {Bot} bot 
     * @param {CommandInteraction} interaction 
     */
    run: async (bot, interaction) => {
        const user = interaction.options.get('user');
        if (user) interaction.reply(`<@!${user.value}> was beaned!`);
        else interaction.reply('You got some beans and ate them with your rice, ah yes...');
    }
};