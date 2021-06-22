const { Message, MessageEmbed } = require('discord.js');
const Bot = require('../../../index');
const { suggestionsChannel } = require('../../../config.json');
const { Gray } = require('../../../colors.json');

module.exports = {
    name: 'suggest',
    usage: 'suggest [suggestion]',
    description: 'Submit a suggestion for the server. Please be sure of what you suggest before doing so.',
    aliases: ['suggestion', 'addsuggestion', 'add-suggestion'],
    cooldown: 600,

    /** 
     * @param {Bot} bot 
     * @param {Message} message 
     * @param {string[]} args 
     */
    run: async (bot, message, args) => {
        if (!args[0]) return message.channel.send('I can\'t add suggestions with no content!');

        // Adds the suggestion to the database
        const suggestion = await bot.suggestions.create({
            content: args.join(' '),
            user_id: message.author.id,
            status: 'Pending'
        });

        // Sends an embed to the suggestions channel with the content
        // Then updates the tag with the embed message ID
        const embed = new MessageEmbed()
            .setColor(Gray)
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setTitle(`Suggestion #${suggestion.id}`)
            .setDescription(suggestion.content)
            .setFooter(suggestion.status)
            .setTimestamp(suggestion.createdAt);
        
        bot.channels.cache.get(suggestionsChannel).send(embed)
            .then(async (m) => {
                const { id: message_id } = m;
                m.react('👍');
                await new Promise(r => setTimeout(r, 1000));
                m.react('👎');
                suggestion.update({ message_id }, { silent: true });
            });

        if (message.deletable) message.delete();
    }
};