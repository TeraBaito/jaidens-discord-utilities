const { Interaction } = require('discord.js');
const Bot = require('../../../Bot');

/**
 * @param {Bot} bot
 * @param {Interaction} interaction 
 */
module.exports = async (bot, interaction) => {
    if (!interaction.member || interaction.member.partial) 
        interaction.member = await interaction.guild.members.fetch(message);

    if (interaction.isCommand()) 
        bot.interactions.get(interaction.commandName).run(bot, interaction);
};