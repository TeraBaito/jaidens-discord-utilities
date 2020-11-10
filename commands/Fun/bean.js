const Discord = require('discord.js');

module.exports = {
    name: 'bean',
    helpName: 'Bean',
    category: 'Fun',
    // aliases: [],
    cooldown: 10,
    usage: 'bean ({@user, whatever else})',
    description: 'Get some beans for yourself or throw beans to others! Featuring everyone can use it, no more mod authority :bwobble:',

    run: async(bot, message, args) => {
        if(!args[0] || message.mentions.users.first() === message.author) {
            return message.channel.send('You got some beans and ate them with your rice, ah yes...');

        } else if (message.mentions.users.first()) {
            if (message.deletable) message.delete();
            return message.channel.send(`${message.mentions.users.first()} was beaned!`);

        } else if (message.guild.members.fetch(args[0])) {
            if (message.deletable) message.delete();
            return message.channel.send(`<@!${args[0]}> was beaned!`);

        } else {
            if (message.deletable) message.delete();
            return message.channel.send(`${args.join(' ')} was beaned!`);
        }
    }
};