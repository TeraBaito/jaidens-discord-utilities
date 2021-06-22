const { Message } = require('discord.js');
const Bot = require('../../../index');
const { checkStaff } = require('../../handlers/functions');

module.exports = {
    name: 'deletetag',
    helpName: 'Delete Tag',
    aliases: ['deltag', 'delete-tag', 'tagdelete', 'tag-delete'],
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

        if (!(await checkStaff(message.member)) || tag.username !== message.author.username) return message.channel.send('You can\'t delete this tag.');
        await bot.tags.destroy({ where: { name: args[0] }});
        return message.channel.send('Tag deleted.');
    }
};