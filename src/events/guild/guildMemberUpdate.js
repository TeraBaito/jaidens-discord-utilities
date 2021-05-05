const { GuildMember } = require('discord.js');
const Bot = require('../../../index');
const { unhoistOne } = require('../../handlers/functions');

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
    unhoistOne(newMember);
};