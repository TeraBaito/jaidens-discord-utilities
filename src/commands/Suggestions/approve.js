const { Message, MessageEmbed } = require('discord.js');
const Bot = require('../../../index');
const { Green } = require('../../../colors.json') ;
const { jaidenServerID, suggestionsChannel } = require('../../../config.json');

module.exports = {
    name: 'approve',
    helpName: 'Approve Suggestion',
    aliases: ['accept'],
    usage: 'approve [suggestion id]',
    description: 'Approves a suggestion based on its ID',
    staffOnly: true,

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
        const suggestion = await bot.suggestions.findOne({ where: { id } });
        if (!suggestion) return message.channel.send(`There's no suggestion with the ID \`${id}\``);
        // Changes its status
        let newData = { status: 'Approved' };
        if (reason) newData.reason = reason;
        await suggestion.update(newData);
        
        // Message and user data
        const msg = await bot.channels.cache.get(suggestionsChannel).messages.fetch(suggestion.message_id);
        const user = await bot.users.fetch(suggestion.user_id);

        // Edits the suggestion embed
        const embed = new MessageEmbed()
            .setColor(Green)
            .setAuthor(user.tag, user.displayAvatarURL())
            .setTitle(`Suggestion #${suggestion.id}`)
            .setDescription(suggestion.content)
            .setFooter(suggestion.status)
            .setTimestamp(suggestion.createdAt)
            .addField('Reason', suggestion.reason);
        msg.edit(embed);

        // DMs the user that their suggestion was approved, error message if unable
        const dmEmbed = new MessageEmbed()
            .setColor(Green)
            .setDescription(`Your suggestion (#${suggestion.id}) has been approved!\n\n[Message Link]`+
            `(https://discord.com/channels/${jaidenServerID}/${suggestionsChannel}/${suggestion.message_id})`);
        user.send(dmEmbed)
            .catch(() => message.channel.send(`Couldn't send an information message to **${user.tag}**!`));
        
        if (message.deletable) message.delete();
    }
};