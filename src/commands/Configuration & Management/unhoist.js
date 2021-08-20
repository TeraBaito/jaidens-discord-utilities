const { Message, MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const Bot = require('../../../Bot');
const { nicknameProcess, promptButtons } = require('../../handlers/functions');

module.exports = {
    name: 'unhoist',
    helpName: 'Member Nickname Unhoisting',
    usage: 'unhoist',
    description: 'Unhoists all hoisted members by a RegExp pattern.',
    staffOnly: true,
    cooldown: 60,

    /**
    * @param {Bot} bot
    * @param {Message} message
    * @param {string[]} args
    */
    run: async(bot, message, args) => {
        const embeds = [
            new MessageEmbed()
                .setColor('RED')
                .setTitle('HOLD UP!')
                .setDescription('Using this command will query server members by their nicknames, and then **mass unhoist** them. This might take a while, and it sends big requests to the API. This command has a cooldown of 2 minutes. Please use it only when strictly necessary.\nAre you sure you want to do this?')
        ];
        const components = [ new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('y')
                    .setLabel('Yes')
                    .setStyle('SUCCESS'),
                new MessageButton()
                    .setCustomId('n')
                    .setLabel('No')
                    .setStyle('DANGER')
            ) ];
        
        const m = await message.channel.send({ embeds, components });
        const button = await promptButtons(m, message.author.id, 30);

        if (button?.customId == 'y') {
            const count = await nicknameProcess(message.guild);
            if (!count) return button?.reply({ content: 'There wasn\'t anyone to remove the hoisting to <:AkaneShrug:774128813037715506>', ephemeral: true});
            button?.reply(`Successfully removed nickname hoisting from \`${count}\` members.`);
        } else button?.reply('Cancelled.');
    }
};