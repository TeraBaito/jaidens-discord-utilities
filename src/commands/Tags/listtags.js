const { bold } = require('@discordjs/builders');
const { Message, MessageEmbed } = require('discord.js');
const Bot = require('../../../Bot');
const { SteelBlue } = require('../../../colors.json');

module.exports = {
    name: 'listtags',
    helpName: 'List Tags',
    aliases: ['tlist', 'tagslist', 'tags-list', 'list-tags'],
    usage: 'listtags',
    description: 'Shows the list of tags (with pagination)',

    /**
    * @param {Bot} bot
    * @param {Message} message
    * @param {string[]} args
    */
    run: async(bot, message, args) => {
        // Sorted tags with a "name - by user" format
        const tags = (await bot.tags.findAll({
            attributes: ['name', 'username']
        }))
            .sort((a, b) => {
                let nameA = a.name.toUpperCase();
                let nameB = b.name.toUpperCase();
                if (nameA < nameB) return -1;
                if (nameA > nameB) return 1;
                return 0;
            })
            .map(t => bold(t.name) + ' - by ' + t.username);
        
        // Find out how many splits it'll need (it'll split every closest number >=200 characters)
        // I made it using the tags as string[] so it wouldn't split between a desc
        // NOTE: Splits are actually EVERY HOW MUCH it'll flatten, not HOW MUCH TIMES it will
        // e.g.: 2 splits will flatten every 2 tags, arr.length splits will not flatten
        let curChars = 0, splits = 0;
        tags.forEach(tag => {
            curChars += tag.length;
            if (curChars >= 200) { curChars = 0; splits++; }
        });

        // i = 0 | tags = 6 | splits = 3 => push 0, 0+3
        // i = 3 | push 3, 3+3
        let split = [];
        if (splits > 0) for (let i = 0; i < tags.length; i += splits) split.push(tags.slice(i, i + splits).join('\n'));
        else split = [tags.join('\n')];

        // Current page (args[0] or 0), if it's less it returns
        let curPage = parseInt(args[0]) - 1 || 0;
        if (curPage < 0) return message.channel.send('Please put a valid page number!');

        let embeds = [
            new MessageEmbed()
                .setTitle('Tags List')
                .setDescription(split[curPage])
                .setFooter(`Page ${curPage+1} of ${split.length}`)
                .setColor(SteelBlue)
        ];

        message.channel.send({ embeds });
    }
};