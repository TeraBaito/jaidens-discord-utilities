const { GuildMember } = require('discord.js');
const { readJSONSync } = require('fs-extra');
const { stripIndents } = require('common-tags');
const Bot = require('../../../Bot');
const { unhoistOne } = require('../../handlers/functions');
const { memberRole,verificationRole, jaidenServerID, mainChannel } = require('../../../config.json');
const eggs = require('../../handlers/eastereggs.json');

/**
 * `guildMemberUpdate` event.
 * 
 * Emitted whenever a guild member changes - i.e. new role, removed role, nickname.
 * Also emitted when the user's details (e.g. username) change.
 * 
 * @param {Bot} bot
 * @param {GuildMember} oldMember
 * @param {GuildMember} newMember 
 */
module.exports = async (bot, oldMember, newMember) => {
    const { shitVerification, welcomer } = readJSONSync('./botSettings.json');
    if (welcomer && shitVerification) {
        if (newMember.guild.id !== jaidenServerID) return;
        // oldMember is fetched directly to the API because it tends to be unreliable
        if (oldMember.partial || !oldMember.nickname || oldMember.roles.cache.size == 1) await oldMember.fetch(true); 
        if (newMember.partial || !newMember.nickname || newMember.roles.cache.size == 1) await newMember.fetch();
    
        if (oldMember.nickname === newMember.nickname) unhoistOne(newMember);
        if (
            oldMember.roles.cache.has(verificationRole) &&
            newMember.roles.cache.has(memberRole) &&
            !newMember.roles.cache.has(verificationRole)
        ) {
            // 0 // 0 < 11 = true // eggs[0]
            // 11 // 11 < 11 = false // default
            // 10 // 10 < 11 = true // eggs[10]

            const num = Math.floor(Math.random() * 100);
            const msg = num < eggs.length ?
                `<@${newMember.id}> ${eggs[num]}` :
                stripIndents`Hello, <@${newMember.id}>. Welcome to r/JaidenAnimations!
    Please make sure to read <#755180458563600445> and the pinned comments / topics for this and other channels.
    And for the context, Jaiden isn't here :p`;

            // Just sends a cool message in chat to welcome the user
            bot.channels.cache.get(mainChannel).send(msg);
        }
    } 
};