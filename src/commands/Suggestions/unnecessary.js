const { Message, MessageEmbed } = require('discord.js');
const Bot = require('../../../Bot');
const { Gray } = require('../../../colors.json') ;
const { jaidenServerID, suggestionsChannel } = require('../../../config.json');

module.exports = {
    name: 'unnecessary',
    helpName: 'unnecessary Suggestion',
    aliases: ['unnecessary', 'unnecessary-suggestion', 'unnecessarysuggestion'],
    usage: 'unnecessary [suggestion id]',
    description: 'Denies a suggestion based on its ID',
    staffOnly: true,
    cooldown: 60,

    /**
    * @param {Bot} bot
    * @param {Message} message
    * @param {string[]} args
    */
    run: async(bot, message, args) => {
        const id = parseInt(args[0]);
        if (!args[0] || isNaN(id)) return message.channel.send('Please specify a valid suggestion ID.');
        const reason = args.slice(1).join(' ');
        
        // Gets the suggestion data by its ID
        let suggestion = await bot.suggestions.findOne({ where: { id } });
        if (!suggestion) return message.channel.send(`There's no suggestion with the ID \`${id}\``);
        // Changes its status
        let newData = { status: 'Unnecessary' };
        if (reason) newData.reason = reason;
        await suggestion.update(newData);

        // Message and user data
        const msg = await bot.channels.cache.get(suggestionsChannel).messages.fetch(suggestion.message_id);
        const user = await bot.users.fetch(suggestion.user_id);

        // Edits the suggestion embed
        const embed = new MessageEmbed()
            .setColor(Gray)
            .setAuthor(user.tag, user.displayAvatarURL())
            .setTitle(`Suggestion #${suggestion.id}`)
            .setDescription(suggestion.content)
            .setFooter(suggestion.status)
            .setTimestamp(suggestion.createdAt)
            .addField('Reason', suggestion.reason);
        msg.edit({ embeds: [embed] });

        // DMs the user that their suggestion was approved, error message if unable
        const dmEmbed = new MessageEmbed()
            .setColor(Gray)
            .setDescription(`Your suggestion [(#${suggestion.id})](https://discord.com/channels/${jaidenServerID}/${suggestionsChannel}/${suggestion.message_id})` +
            ' has been marked unnecessary. This could mean it\'s duplicated,'+
            ' doesn\'t provide proper feedback, or breaks the server\'s or Discord\'s rules. Remember you can\'t suggest'+
            ' this again, and to always think twice before you do any other suggestion.');
        user.send({ embeds: [dmEmbed] })
            .catch(() => message.channel.send({
                content: `Couldn't send an information message to **${user.tag}**!`,
                allowedMentions: { parse: null }
            }));
        
        if (message.deletable) message.delete();
    }
};