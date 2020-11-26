const Discord = require('discord.js');

module.exports = {
    /**
     * Finds member object by mention, id, name or display name
     * 
     * (SELF-REMINDER: put await before calling function)
     * 
     * (SELF-REMINDER: set a variable and call the function, not do things like getMember(...).id)
     * 
     * @param {Discord.Message} message The Message object to perform actions using message
     * @param {String} toFind String that fetches the user (can be mention, id, tag, or displayName)
     */
    getMember: async function(message, toFind = '') {
        toFind = toFind.toLowerCase();

        // Tries getting from ID
        let target = await message.guild.members.fetch(toFind);

        // Then, tries getting from @mention
        if(!target && message.mentions.members)
            target = message.mentions.members.first();

        // Then, tries getting from tag or displayName
        if(!target && toFind)
            target = message.guild.members.cache.find(member => {
                return member.displayName.toLowerCase().includes(toFind) ||
                member.user.tag.toLowerCase().includes(toFind);
            });

        if(!target)
            target = message.member;

        return target;
    },

    /**
     * Formats a given Date() to be shown in en-US format with "Weekday, Month D, YYYY, HH:MM:SS" display
     * 
     * @param {Date} date 
     */
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

    /**
     * Sends a message (prompt) with X reactions, the bot will take action depending on the chosen reaction.
     * 
     * @param {Discord.Message} message The Message object to perform actions using message
     * @param {Discord.User|Discord.GuildMember} author The author of the message, so that actions only perform based on theirs
     * @param {Number} time Prompt message expiration time in seconds
     * @param {Array} validReactions Array with reactions the bot will listen to
     */
    promptMessage: async function(message, author, time, validReactions) {
        time *= 1000;

        for(const reaction of validReactions) await message.react(reaction);

        const filter = (reaction, user) => validReactions.includes(reaction.emoji.name) && user.id === author.id;

        return message
            .awaitReactions(filter, { max: 1, time: time})
            .then(collected => collected.first() && collected.first().emoji.name);
    },

    /**
     * Gives a random number between 0 and number parameter, use Math.floor(randomizePercentage()) to get a natural number.
     * 
     * @param {Number} number Max number to randomize
     */
    randomizePercentage: function(number) {
        return Math.random() * number;
    },

    /**
     * Blacklisting words process
     * 
     * Actions it takes: deletes the message
     * @param {Discord.Message} message The Message object to perform actions using message
     */
    blacklistProcess: function(message) {
        const { words } = require('./blacklisted-words');
        if(words.some(word => message.content.toLowerCase().includes(word))) {
            if (message.deletable) message.delete();
        }
    }
};