const Discord = require('discord.js');

module.exports = {
    /**
     * Finds and returns member object by ID, mention, displayName, username or tag (respectively)
     * 
     * @param {Discord.Message} message The Message object to perform actions using message
     * @param {String} toFind String that fetches the user (can be mention, id, tag, or displayName)
     */
    getMember: function(message, toFind) {
        toFind = toFind.toLowerCase();

        // First, tries to get from ID (all members should work, since bot has fetchAllMembers: true)
        let target = message.guild.members.cache.get(toFind);

        // Then, tries to get from mention
        if (!target && message.mentions.members) target = message.mentions.members.first();

        // Then, tries getting from tag or displayName
        if(!target && toFind)
            target = message.guild.members.cache.find(member => {
                // Then, tries to get from displayName (nickname -> username)
                return member.displayName.toLowerCase().includes(toFind) ||
                // Then, solely for username (this is so that a nickname doesn't overwrite a username when used)
                member.user.username.toLowerCase().includes(toFind) ||
                // Then, tries getting it for mention
                member.user.tag.toLowerCase().includes(toFind);
            });

        // If none of those work, it uses the GuildMember from who sent a message that triggered this function
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