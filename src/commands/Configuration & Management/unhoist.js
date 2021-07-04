const { Message, MessageEmbed } = require('discord.js');
const Bot = require('../../../Bot');
const { nicknameProcess, promptMessage } = require('../../handlers/functions');

module.exports = {
    name: 'unhoist',
    helpName: 'Member Nickname Unhoisting',
    usage: 'unhoist',
    description: 'MOD COMMAND ONLY\nUnhoists all hoisted members by a RegExp pattern.',
    staffOnly: true,
    cooldown: 120,

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
        const m = await message.channel.send({ embeds });
        const emoji = await promptMessage(m, message.member, 30, '✅', '❌');
        if (emoji == '✅') {
            const count = await nicknameProcess(message.guild);
            if (!count) return message.channel.send('There wasn\'t anyone to remove the hoisting to <:AkaneShrug:774128813037715506>');
            message.channel.send(`Successfully removed nickname hoisting from \`${count}\` members.`);
        } else if (emoji == '❌') return message.channel.send('Cancelled.');
    }
};