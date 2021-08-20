const { Message } = require('discord.js');
const Bot = require('../../../Bot');
const { checkStaff } = require('../../handlers/functions');

module.exports = {
    name: 'tag',
    helpName: 'Get Tag',
    usage: 'tag [name]',
    description: 'Gets the content of a tag',
    aliases: ['t', 'gettag'],
    cooldown: 5,

    /** 
     * @param {Bot} bot 
     * @param {Message} message 
     * @param {string[]} args 
     */
    run: async (bot, message, args) => {
        if (!args[0]) return message.channel.send('Please specify a tag.');

        const tag = await bot.tags.findOne({ where: { name: args[0] }});
        if (tag) {
            if (tag.staff_only && !await checkStaff(message.member)) return message.channel.send('This tag is staff only, you\'re not allowed to view it.');
            tag.increment('usage_count');
            return message.channel.send(tag.get('description'));
        }
        return message.channel.send(`Couldn't find tag: \`${args[0]}\``);
    }
};