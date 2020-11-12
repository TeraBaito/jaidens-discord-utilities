const Discord = require('discord.js');
const colors = require('../../colors.json');

module.exports = {
    name: 'event',
    helpName: 'Start/End November 15th Event',
    category: 'Configuration & Management',
    aliases: [],
    usage: 'event',
    description: 'Starts or ends the server event mechanics',

    run: async(bot, message, args) => {
        // SELF-REMINDER: Change this to the Event VC ID Later
        const voiceChannel = message.guild.channels.cache.get(bot.event.vcID);
        if (!message.member.roles.cache.find(r => r.name === 'Staff')) return; // only listen to Staff role
        
        try {
            message.channel.send('Event will start in 10 seconds!');
            // Where the fun begins
            setTimeout(() => {
                voiceChannel.members.map(m => m.id).forEach(elem => {
                    bot.event.members.add(elem);
                });
                bot.event.started = true;
                bot.event.startTimestamp = Date.now();
                message.guild.channels.cache.get(bot.event.announceID).send('The VC Challenge has started. The one who stays for the most time will win. Good luck everyone!');                
            }, 10000);
        } catch (e) {
            const errEmbed = new Discord.MessageEmbed()
                .setColor(colors.Red)
                .setTitle('Something\'s wrong...')
                .addField('Error', `\`${e.message}\``);
            message.channel.send(errEmbed);
            console.log(e);
        }
        
    }
};