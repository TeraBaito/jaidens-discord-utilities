const { CommandInteraction } = require('discord.js');
const Bot = require('../../Bot');
const { readJSONSync, writeJSONSync } = require('fs-extra');
const { jaidenServerID } = require('../../config.json');

module.exports = {
    data: {
        name: 'toggle',
        description: 'STAFF ONLY. Enables or disables a slash command',
        options: [{
            name: 'command',
            type: 'STRING',
            description: 'The slash command that should be enabled or disabled',
            required: true
        }],
        defaultPermission: false
    },
    staffOnly: true,

    /**
     * @param {Bot} bot 
     * @param {CommandInteraction} interaction 
     */
    run: async (bot, interaction) => {
        const data = readJSONSync('./botSettings.json');

        const { value: command } = interaction.options.get('command');
        if (command == 'toggle') return interaction.reply({ content: '> Hey you little shit, don\'t get us started\n- Tera', ephemeral: true });
        else if (bot.interactions.has(command)) {
            if (data.disabledInteractions.includes(command)) { // disabled -> enabled
                const commandData = require(`./${command}`);
                // I took this from my functions file but without iterating
                const created = await bot.guilds.cache.get(jaidenServerID).commands.create(commandData.data);

                if (commandData.staffOnly) created.permissions.add({ permissions: [
                    { id: '756585204344291409', type: 'ROLE', permission: true }, // Staff
                    { id: '775665978813054986', type: 'ROLE', permission: true }, // Helpers
                    { id: '755094113358970900', type: 'ROLE', permission: true }, // Moderators
                    { id: '755093779282657342', type: 'ROLE', permission: true }, // Administrators
                    { id: '558264504736153600', type: 'USER', permission: true }  // Me
                ]});
                else if (commandData.permissions) created.permissions.add({ permissions: commandData.permissions });

                data.disabledInteractions.splice(data.disabledInteractions.indexOf(command), 1);
                writeJSONSync('./botSettings.json', data, { spaces: 4 });
                return interaction.reply({ content: `Enabled \`${command}\` successfully`, ephemeral: true });
            } else {                                    // enabled -> disabled
                await bot.guilds.cache.get(jaidenServerID).commands.cache.find(cmd => cmd.name === command).delete();
                data.disabledInteractions.push(command);
                writeJSONSync('./botSettings.json', data, { spaces: 4 });
                return interaction.reply({ content: `Disabled \`${command}\` successfully`, ephemeral: true });
            }
        } else return interaction.reply({ content: `\`${command}\` doesn't seem to exist...`, ephemeral: true });
    }
};