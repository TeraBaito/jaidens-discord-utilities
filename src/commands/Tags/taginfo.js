const { Message, MessageEmbed } = require('discord.js');
const { time } = require('@discordjs/builders');
const { ForestGreen } = require('../../../colors.json');
const Bot = require('../../../Bot');

module.exports = {
    name: 'taginfo',
    helpName: 'Tag Info',
    aliases: ['tinfo', 'tag-info', 'tagdata', 'tag-data'],
    usage: 'taginfo [name]',
    description: 'Displays the information of a tag',
    cooldown: 10,

    /**
     * 
     * @param {Bot} bot 
     * @param {Message} message 
     * @param {string[]} args 
     */
    run: async (bot, message, args) => {
        if (!args[0]) return message.channel.send('Please specify a tag.');
        
        const tag = await bot.tags.findOne({ where: { name: args[0] } });

        if (tag) {
            const embeds = [ new MessageEmbed()
                .setTitle(`${tag.name}${tag.staff_only ? ' - Staff Only' : ''}`)
                .setColor(ForestGreen)
                .addFields(
                    { name: 'Created by', value: tag.username, inline: true },
                    { name: 'Uses', value: tag.usage_count.toString() },
                    { name: 'Created at', value: time(tag.createdAt) }
                ) ];
            return message.channel.send({ embeds });
        }
        return message.channel.send(`Couldn't find tag \`${args[0]}\`.`);
    }
};