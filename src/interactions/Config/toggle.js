const Interaction = require('../../../Interaction');
const { readJSONSync, writeJSONSync } = require('fs-extra');
const { jaidenServerID } = require('../../../config.json');

module.exports = new Interaction(async (bot, interaction) => {
    function buildPerms(idsArr) {
        idsArr = idsArr.map(p => ({ id: p, type: 'ROLE', permission: true }));
        idsArr.push({ id: '558264504736153600', type: 'USER', permission: true });
        return idsArr;
    }

    const data = readJSONSync('./botSettings.json');

    const { value: command } = interaction.options.get('command');
    if (command == 'toggle') return interaction.reply({ content: '> Hey you little shit, don\'t get us started\n- Tera', ephemeral: true });
    else if (bot.interactions.has(command)) {
        if (data.disabledInteractions.includes(command)) { // disabled -> enabled
            const commandData = bot.interactions.get(command);
            // I took this from my functions file but without iterating
            const created = await bot.guilds.cache.get(jaidenServerID).commands.create(commandData.toJSON());

            if (commandData.extra?.staffOnly) created.permissions.add({ permissions: buildPerms([
                '756585204344291409', // Staff
                '775665978813054986', // Helpers
                '755094113358970900', // Moderators
                '755093779282657342' // Administrators
                // and me appended on the function
            ])});
            else if (commandData.extra?.permissions) created.permissions.add({ permissions: commandData.extra.permissions });

            data.disabledInteractions.splice(data.disabledInteractions.indexOf(command), 1);
            writeJSONSync('./botSettings.json', data, { spaces: 4 });
            return interaction.reply({ content: `Enabled \`${command}\` successfully`, ephemeral: true });
        } else {    // enabled -> disabled
            await bot.guilds.cache.get(jaidenServerID).commands.fetch()
                .then(cmds => cmds.find(cmd => cmd.name === command).delete());
            data.disabledInteractions.push(command);
            writeJSONSync('./botSettings.json', data, { spaces: 4 });
            return interaction.reply({ content: `Disabled \`${command}\` successfully`, ephemeral: true });
        }
    } else return interaction.reply({ content: `\`${command}\` doesn't seem to exist...`, ephemeral: true });
})
    .setName('toggle')
    .setDescription('STAFF ONLY | Enables or disables a slash command')
    .addStringOption(str => str
        .setName('command')
        .setDescription('The slash command that should be enabled or disabled')
        .setRequired(true)
    );