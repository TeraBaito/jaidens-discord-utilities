const Discord = require('discord.js');
const { nicknameProcess, unhoistOne } = require('../../handlers/functions');

/**
 * `guildMemberUpdate` event.
 * 
 * Emitted whenever a guild member changes - i.e. new role, removed role, nickname.
 * Also emitted when the user's details (e.g. username) change.
 * 
 * @param {Discord.Client} bot
 * @param {Discord.GuildMember} oldMember
 * @param {Discord.GuildMember} newMember 
 */
module.exports = async (bot, oldMember, newMember) => {
    unhoistOne(newMember);
};