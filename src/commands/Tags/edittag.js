const { Message } = require('discord.js');
const Bot = require('../../../Bot');
const { checkStaff } = require('../../handlers/functions');

module.exports = {
    name: 'edittag',
    helpName: 'Edit Tag',
    aliases: ['tedit', 'edit-tag', 'tagedit', 'tag-edit'],
    usage: 'addtag [name] [content]',
    description: 'Edits a tag\'s content',
    cooldown: 10,

    /** 
     * @param {Bot} bot 
     * @param {Message} message 
     * @param {string[]} args 
     */
    run: async (bot, message, args) => {
        if (!args[0]) return message.channel.send('Please specify a tag.');
        if (!args[1]) return message.channel.send('Please specify the new content of the tag.');

        const tag = await bot.tags.findOne({ where: { name: args[0] } });
        if (tag.username !== message.author.username && !await checkStaff(message.member)) return message.channel.send('You can\'t edit this tag.');

        const affectedRows = await bot.tags.update({ description: args.slice(1).join(' ') }, { where: { name: args[0] } });
        if (affectedRows > 0) {
            return message.channel.send(`Tag \`${args[0]}\` was edited.`);
        }
        return message.channel.send(`Couldn't find a tag with name \`${args[0]}\`.`);
    }
};
