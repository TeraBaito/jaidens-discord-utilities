const Discord = require('discord.js');
const ms = require('ms');
const { stripIndents } = require('common-tags');
const colors = require('../../colors.json');


/**
 * `voiceStateUpdate` event
 * 
 * Emitted whenever a member changes voice state - e.g. joins/leaves a channel, mutes/unmutes.
 * 
 * @param {Discord.Client} bot The Client object of the bot
 * @param {Discord.VoiceState} oldState VoiceState of the member before the event changing
 * @param {Discord.VoiceState} newState VoiceState of the member after the event changing
 */
module.exports = async (bot, oldState, newState) => {
    /* LOGS (testing purposes only) (put where they should be) */
    // console.log(bot.eventMembers);
    // console.log(bot.eventStarted);
    // console.log((oldState.channelID || newState.channelID) != bot.event.vcID);
    /* console.log(stripIndents
    `${bot.event.startTimestamp}: ${typeof bot.event.startTimestamp}
    ${bot.event.endTimestamp}: ${typeof bot.event.endTimestamp}`); */
    // console.log(`Is the Set of size 1? ${bot.event.members.size === 1}`);

    // Make it not listen to other VCs
    // SELF-REMINDER: change VC ID
    if ((oldState.channelID || newState.channelID) != bot.event.vcID) return;
    if (newState.channel === null && bot.event.started) {
        bot.event.members.delete(oldState.id);

        if (bot.event.members.size == 1) {
            let winnerID = [...bot.event.members][0];
            bot.event.started = false;
            bot.event.endTimestamp = Date.now();

            // Send winner message (mention will work whether there's a nick or not)
            // SELF-REMINDER: change ID to some announcments channel
            bot.channels.cache.get(bot.event.announceID).send(`The winner is <@!${winnerID}>. Congrats, you have won the VC event!`, {
                embed: {
                    color: `0x${colors.CornflowerBlue}`, // colors.CornflowerBlue
                    fields: [
                        {
                            name: 'Start Time',
                            value: `${formatDate(bot.event.startTimestamp)} UTC`,
                            inline: false
                        },
                        {
                            name: 'End Time',
                            value: `${formatDate(bot.event.startTimestamp)} UTC`,
                            inline: false
                        },
                        {
                            name: 'Time Taken',
                            value: ms(bot.event.endTimestamp - bot.event.startTimestamp, {long: true}),
                            inline: false
                        }
                    ]
                }
            });
        }
    }
};

/**
 * Formats the date given
 * 
 * @param {Date} date A Date object to format
 */
function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        timeZone: 'UTC',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    }).format(date);
}


