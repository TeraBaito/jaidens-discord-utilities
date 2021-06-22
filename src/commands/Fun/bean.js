const { Message } = require('discord.js');
const Bot = require('../../../index');

module.exports = {
    name: 'bean',
    usage: 'bean ({@user, id, whatever else})',
    description: 'Get some beans for yourself or throw beans to others! Featuring everyone can use it, no more mod authority :bwobble:',
    cooldown: 20,

    /** 
     * @param {Bot} bot 
     * @param {Message} message 
     * @param {string[]} args 
     */
    run: async(bot, message, args) => {
        if(!args[0] || message.mentions.users.first() === message.author) {
            return message.channel.send('You got some beans and ate them with your rice, ah yes...');

        } else if (message.mentions.users.first()) {
            if (message.deletable) message.delete();
            return message.channel.send(`${message.mentions.users.first()} was beaned!`);

        } else if (message.guild.members.cache.get(args[0])) {
            if (message.deletable) message.delete();
            return message.channel.send(`<@!${args[0]}> was beaned!`);

        } else {
            if (message.deletable) message.delete();
            return message.channel.send(`${args.join(' ')} was beaned!`);
        }
    }
};