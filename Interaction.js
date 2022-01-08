const { SlashCommandBuilder } = require('@discordjs/builders');
const Bot = require('./Bot');
const { CommandInteraction } = require('discord.js');

/**
 * @callback RunFunction
 * @param {Bot} bot 
 * @param {CommandInteraction} interaction 
 * @returns {void}
 */

/**
* @typedef {Object} ExtraData
* @property {boolean?} staffOnly Whether the interaction's permissions will be only for staff roles
* @property {ApplicationCommandPermissionData[]?} permissions
*/

class Interaction extends SlashCommandBuilder {
    /** 
     * @constructor
     * @param {RunFunction} run 
     * @param {ExtraData} extra
     */
    constructor(run, extra) {
        super();
        if (extra?.staffOnly || extra?.permissions) this.setDefaultPermission(false);
        this.extra = extra ?? null;
        this.run = run;
    }
}
module.exports = Interaction;

/**
 * Data for setting the permissions of an application command.
 * @typedef {Object} ApplicationCommandPermissionData
 * @property {string} id The role or user's id
 * @property {"ROLE"|"USER"|number} type Whether this permission is for a role or a user
 * @property {boolean} permission Whether the role or user has the permission to use this command
 */



