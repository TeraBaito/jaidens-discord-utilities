const { Message, MessageEmbed } = require('discord.js');
const { ForestGreen } = require('../../../colors.json');
const Bot = require('../../../index');
const { formatDate } = require('../../handlers/functions');
const { suggestionsChannel } = require('../../../config.json');

module.exports = {
    name: 'taginfo',
    helpName: 'Tag Info',
    aliases: ['tag-info', 'tagdata', 'tag-data'],
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
            const embed = new MessageEmbed()
                .setTitle(tag.name)
                .setColor(ForestGreen)
                .addFields(
                    { name: 'Created by', value: tag.username, inline: true },
                    { name: 'Uses', value: tag.usage_count },
                    { name: 'Created at', value: formatDate(tag.createdAt) }
                );
            return message.channel.send(embed);
        }
        return message.channel.send(`Couldn't find tag \`${args[0]}\`.`);
    }
};