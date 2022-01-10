const { Message } = require('discord.js');
const Bot = require('../../../Bot');
const { checkStaff } = require('../../handlers/functions');

module.exports = {
    name: 'addtag',
    aliases: ['tadd', 'add-tag', 'tagadd', 'tag-add'],
    helpName: 'Add Tag',
    usage: 'addtag [name] [content]',
    description: 'Adds a tag to the database',
    cooldown: 10,

    /** 
     * @param {Bot} bot 
     * @param {Message} message 
     * @param {string[]} args 
     */
    run: async (bot, message, args) => {
        if (!args[0]) return message.channel.send('Please specify a tag.');
        if (!args[1]) return message.channel.send('Please specify the content of the tag.');
        let name = args[0], desc = args.slice(1).join(' ');
        if (args[0] === 'staff') {
            if (!await checkStaff(message.member)) return message.channel.send('You can\'t create staff only tags.');
            name = args[1]; desc = args.slice(2).join(' ');
        }
        try {
            const tag = await bot.tags.create({
                name,
                description: desc,
                username: message.author.username,
                staff_only: args[0] === 'staff'
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