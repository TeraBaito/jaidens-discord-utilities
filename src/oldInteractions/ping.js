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
        const msg = await interaction.deferReply({ fetchReply: true });
        await interaction.editReply(stripIndents`Pong!
            Latency: ${Math.floor(msg.createdAt - interaction.createdAt)}ms
            Discord API Latency: ${bot.ws.ping}ms`);
    }
};