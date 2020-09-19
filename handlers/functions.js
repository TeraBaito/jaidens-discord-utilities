const Discord = require('discord.js');
const fs = require('fs');
const colors = require('../colors.json');

module.exports = {
    // Finds member object by mention, id, name or display name
    getMember: function(message, toFind = '') {
        toFind = toFind.toLowerCase();

        let target = message.guild.members.cache.get(toFind);

        if(!target && message.mentions.members)
            target = message.mentions.members.first();

        if(!target && toFind)
            target = message.guild.members.cache.find(member => {
                return member.displayName.toLowerCase().includes(toFind) ||
                message.user.tag.toLowerCase().includes(toFind);
            });
        
        if(!target)
            target = message.member;

        return target;
    },

    // Formats a given Date() to be shown in en-US format with "Weekday, Month D, YYYY, HH:MM:SS" display
    formatDate: function(date) {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        }).format(date);
    },

    // Sends a message (prompt) with X reactions, the bot will take action depending on the chose reaction
    promptMessage: async function(message, author, time, validReactions) {
        time *= 1000;

        for(const reaction of validReactions) await message.react(reaction);

        const filter = (reaction, user) => validReactions.includes(reaction.emoji.name) && user.id === author.id;

        return message
            .awaitReactions(filter, { max: 1, time: time})
            .then(collected => collected.first() && collected.first().emoji.name);
    },

    // Gives a random number between 0 and number parameter, use Math.floor(randomizePercentage()) to get natural number
    randomizePercentage: function(number) {
        return Math.random() * number;
    },
    
    // Blacklisting words process (put mutetime in seconds)
    // Deletes the message, DMs the infractor and mutes for a specified time
    blacklistProcess: function(bot, message, mutetime) {

        const logEmbed = new Discord.MessageEmbed()
            .setColor(colors.ForestGreen)
            .setFooter(message.member.displayName)
            .setDescription('Message Deleted')
            .addField('Message', message.content);

        const { words } = require('./blacklisted-words');
        words.forEach(word => {
            if (message.content.toLowerCase().includes(word)) {
                if (!message.member.roles.cache.find(r => r.id === '756585204344291409')) message.delete();
            }
        });
        /*
        await(toTempmute.roles.add(muterole.id));
        message.channel.send(`${toTempmute} has been muted for ${ms(ms(mutetime))}`)
            .catch(err => {
                if(err) return message.channel.send('Well... something went wrong');
            });
                
        logChannel.send(mEmbed);
        

        setTimeout(() => {
            toTempmute.roles.remove(muterole.id);
            logChannel.send(umEmbed);
        }, mutetime * 1000);*/
    }
};