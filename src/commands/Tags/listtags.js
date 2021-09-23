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

        /**
         * Splits an array every x elements
         * from stackoverflow lolllllll
         * @param {Array} arr 
         * @param {number} size Every how much it'll split
         * @returns {Array}
         */
        function paginate (arr, size) {
            return arr.reduce((acc, val, i) => {
                let idx = Math.floor(i / size);
                let page = acc[idx] || (acc[idx] = []);
                page.push(val);
              
                return acc;
            }, []);
        }

        // Current page (args[0] or 0), if it's less it returns
        let curPage = parseInt(args[0]) - 1|| 0;
        if (curPage < 0) return message.channel.send('Please put a valid page number!');
        let pages = paginate(tags, 10);
        let embeds = [
            new MessageEmbed()
                .setTitle('Tags List')
                .setDescription(pages[curPage].join('\n'))
                .setFooter(`Page ${curPage+1} of ${pages.length}`)
                .setColor(SteelBlue)
        ];

        message.channel.send({ embeds });
    }
};