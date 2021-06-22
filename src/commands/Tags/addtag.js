const { Message, Util: { removeMentions } } = require('discord.js');
const Bot = require('../../../index');

module.exports = {
    name: 'addtag',
    aliases: ['add-tag', 'tagadd', 'tag-add'],
    helpName: 'Add Tag',
    usage: 'addtag [name] [content]',
    description: 'Adds a tag to the database',
    cooldown: 20,

    /** 
     * @param {Bot} bot 
     * @param {Message} message 
     * @param {string[]} args 
     */
    run: async (bot, message, args) => {
        if (!args[0]) return message.channel.send('Please specify a tag.');
        if (!args[1]) return message.channel.send('Please specify the content of the tag.');

        try {
            const tag = await bot.tags.create({
                name: args[0],
                description: removeMentions(args.slice(1).join(' ')),
                username: message.author.username
            });
            return message.channel.send(`Tag \`${tag.name}\` added.`);
        } catch (e) {
            if (e.name === 'SequelizeUniqueConstraintError') {
                return message.channel.send('That tag already exists.');
            }
            return message.channel.send('Something went wrong with adding the tag.');
        }
    }
};