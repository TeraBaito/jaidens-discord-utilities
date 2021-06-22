const { Message } = require('discord.js');
const Bot = require('../../../index');

module.exports = {
    name: 'tag',
    helpName: 'Get Tag',
    usage: 'tag [name]',
    description: 'Gets the content of a tag',
    aliases: ['t', 'gettag'],
    cooldown: 10,

    /** 
     * @param {Bot} bot 
     * @param {Message} message 
     * @param {string[]} args 
     */
    run: async (bot, message, args) => {
        if (!args[0]) return message.channel.send('Please specify a tag.');

        const tag = await bot.tags.findOne({ where: { name: args[0] }});
        if (tag) {
            tag.increment('usage_count');
            return message.channel.send(tag.get('description'));
        }
        return message.channel.send(`Couldn't find tag: \`${args[0]}\``);
    }
};