const { CommandInteraction } = require('discord.js');
const Bot = require('../../Bot');
const { stripIndents } = require('common-tags');

module.exports = {
    data: {
        name: 'ping',
        description: 'Shows the bot uptime'
    },

    /**
     * @param {Bot} bot 
     * @param {CommandInteraction} interaction 
     */
    run: async (bot, interaction) => {
        await interaction.reply(stripIndents`Pong!
            Discord API Latency: ${bot.ws.ping}ms`);
    }
};