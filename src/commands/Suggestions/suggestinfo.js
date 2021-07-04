const { Message, MessageEmbed, MessageReaction, Collection } = require('discord.js');
const Bot = require('../../../Bot');
const { formatDate } = require('../../handlers/functions');
const { jaidenServerID, suggestionsChannel } = require('../../../config.json');
const { Orange } = require('../../../colors.json');

module.exports = {
    name: 'suggestinfo',
    helpName: 'Suggestion Info',
    aliases: ['sinfo', 'sabout', 'suggestioninfo', 'suggestion-info', 'suggest-info', 'suggestdata', 'suggest-data', 'aboutsuggestion', 'suggestionabout'],
    usage: 'suggestinfo [id]',
    description: 'Shows the stored data of a suggestion.',
    cooldown: 60,

    /**
    * @param {Bot} bot
    * @param {Message} message
    * @param {string[]} args
    */
    run: async(bot, message, args) => {
        const id = parseInt(args[0]);
        if (!args[0] || isNaN(id)) message.channel.send('Please specify a valid suggestion ID.');

        // Gets the suggestion of the database
        const suggestion = await bot.suggestions.findOne({ where: { id } });
        if (!suggestion) return message.channel.send(`There's no suggestion with the ID \`${id}\``);
        // Fetches the user
        const user = await bot.users.fetch(suggestion.user_id);
        const msg = await bot.channels.cache.get(suggestionsChannel).messages.fetch(suggestion.message_id);
        /** @type {Collection<string, MessageReaction>} */
        const reactions = await msg.reactions.cache;
        const upvotes = (await reactions.get('👍').users.fetch()).size - 1,
            downvotes = (await reactions.get('👎').users.fetch()).size - 1;
        
        const ratios = () => {
            /*  3      x
               --- :: ---
                5     100  */
            const total = upvotes + downvotes;
            const uR = 100 * upvotes / total,
                dR = 100 - uR;
            if (isNaN(uR)) return 'None yet';
            return `${uR}% | ${dR}%`;
        };


        // Sends an embed with the suggestion data
        const embed = new MessageEmbed()
            .setColor(Orange)
            .setTitle(`Suggestion #${id}`)
            .setURL(`https://discord.com/channels/${jaidenServerID}/${suggestionsChannel}/${suggestion.message_id}`)
            .addFields(
                { name: 'Content', value: suggestion.content },
                { name: 'Status', value: suggestion.status }
            );
        if (suggestion.status != 'Pending') embed.addField('Reason', suggestion.reason);
        embed.addFields(
            { name: 'Created by', value: `${user}`, inline: true },
            { name: 'Created at', value: formatDate(suggestion.createdAt) },
            { name: 'Upvotes', value: upvotes, inline: true },
            { name: 'Downvotes', value: downvotes, inline: true },
            { name: 'Ratio', value: ratios(), inline: true }
        );
        message.channel.send({ embeds: [embed] });
    }
};