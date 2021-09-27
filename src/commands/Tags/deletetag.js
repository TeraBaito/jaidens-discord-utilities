const { Message } = require('discord.js');
const Bot = require('../../../Bot');
const { checkStaff } = require('../../handlers/functions');

module.exports = {
    name: 'deletetag',
    helpName: 'Delete Tag',
    aliases: ['tdelete', 'deltag', 'delete-tag', 'tagdelete', 'tag-delete'],
    usage: 'deletetag [name]',
    description: 'Deletes a tag from the database',
    cooldown: 10,

    /**
     * @param {Bot} bot 
     * @param {Message} message 
     * @param {string[]} args 
     */
    run: async (bot, message, args) => {
        if (!args[0]) return message.channel.send('Please specify a tag.');
           
        const tag = await bot.tags.findOne({ where: { name: args[0] } });
        if (!tag) return message.channel.send(`The tag \`${args[0]}\` doesn't exist.`);

        if (tag.username !== message.author.username && !await checkStaff(message.member)) return message.channel.send('You can\'t edit this tag.');
        await bot.tags.destroy({ where: { name: args[0] }});
        return message.channel.send('Tag deleted.');
    }
};
