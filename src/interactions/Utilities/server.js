const Interaction = require('../../../Interaction');
const { MessageEmbed } = require('discord.js');
const { time } = require('@discordjs/builders');
const colors = require('../../../colors.json');

module.exports = new Interaction(async (bot, interaction) => {
    const icon = interaction.guild.iconURL();
    const owner = await interaction.guild.fetchOwner();

    const embeds = [ new MessageEmbed()
        .setDescription('**Server Information**')
        .setColor(colors.Purple)
        .setThumbnail(icon)
        .addField('Name', interaction.guild.name)
        .addField('ID', interaction.guild.id)
        .addField('Created On', time(interaction.guild.createdAt))
        .addField('Member Count', `<:totalmembers:742403092217200640>${interaction.guild.memberCount} Total`)
        .addField('Channel Count', interaction.guild.channels.cache.size.toString())
        .addField('Owner', owner.toString()) ];

    interaction.reply({ embeds });
})
    .setName('server')
    .setDescription('Shows general information about the server');