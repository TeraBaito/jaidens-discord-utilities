const { stripIndents } = require('common-tags');
const { Message, MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const Bot = require('../../../Bot');
const { readJSONSync, writeJSONSync } = require('fs-extra');
const colors = require('../../../colors.json');
const { promptButtons } = require('../../handlers/functions');

module.exports = {
    name: 'settings',
    helpName: 'Bot Core Settings',
    aliases: ['botSettings', 'config', 'botConfig'],
    usage: `settings (equal to a+settings list)
a+settings {welcomer, blacklisting, list, reset}
a+settings {enable, disable} [command]
a+settings enable all`,
    description: 'Enables and disables core settings of the bot, such as welcomer or specific commands.',
    staffOnly: true,

    /**
    * @param {Bot} bot
    * @param {Message} message
    * @param {string[]} args
    */
    run: async(bot, message, args) => {
        /**  @type {{ welcomer: boolean blacklisting: boolean blacklistLogs: boolean disabledCommands: string[] disabledInteractions: string[] }} */
        const data = readJSONSync('./botSettings.json', 'utf-8');
        let { disabledCommands } = data;
        const input = args[1];

        /** @param {boolean} elem */
        const formatBool = (elem) => elem ? 'Enabled' : 'Disabled';

        switch(args[0]?.toLowerCase()) {
            case 'welcomer':
            case 'announce':
            case 'welcome': {
                data.welcomer = !data.welcomer; // Set
                const embeds = [ new MessageEmbed()
                    .setColor(colors.ForestGreen)
                    .setDescription(`\`${formatBool(data.welcomer)}\` welcomer settings`)
                    .setFooter('It might take some time while changes apply!') ];

                await message.channel.send({ embeds });
                writeJSONSync('./botSettings.json', data, { spaces: 4 });
                break;
            }

            case 'blacklisting':
            case 'blacklist': {
                data.blacklisting = !data.blacklisting; // Set
                const embeds = [ new MessageEmbed()
                    .setColor(colors.ForestGreen)
                    .setDescription(`\`${formatBool(data.blacklisting)}\` blacklisting settings`)
                    .setFooter('It might take some time while changes apply!') ];

                await message.channel.send({ embeds });
                writeJSONSync('./botSettings.json', data, { spaces: 4 });
                break;
            }
            case 'blacklistlogs':
            case 'blacklistdebug': {
                data.blacklistLogs = !data.blacklistLogs; // Set
                const embeds = [ new MessageEmbed()
                    .setColor(colors.ForestGreen)
                    .setDescription(`\`${formatBool(data.blacklistLogs)}\` blacklisting logs`)
                    .setFooter('It might take some time while changes apply!') ];

                await message.channel.send({ embeds });
                writeJSONSync('./botSettings.json', data, { spaces: 4 });
                break;
            }
            case 'autoresponders':
            case 'autoresponder': {
                data.autoresponders = !data.autoresponders; // Set
                const embeds = [ new MessageEmbed()
                    .setColor(colors.ForestGreen)
                    .setDescription(`\`${formatBool(data.autoresponders)}\` autoresponders`)
                    .setFooter('It might take some time while changes apply!') ];

                await message.channel.send({ embeds });
                writeJSONSync('./botSettings.json', data, { spaces: 4 });
                break;
            }
            case 'enable': {
                if (input == 'all') {
                    disabledCommands.splice(0, disabledCommands.length);
                    await message.channel.send({ embeds: [
                        new MessageEmbed()
                            .setColor(colors.PaleBlue)
                            .setDescription('Enabled all previously disabled commands')
                            .setFooter('It might take some time changes apply!')
                    ]});
                    writeJSONSync('./botSettings.json', data, { spaces: 4 });
                    return; 
                }

                if (!bot.commands.get(input)) return message.channel.send(`There's not such command as \`${input}\`!`);
                if (!disabledCommands.includes(input)) return message.channel.send(`The command \`${input}\` is not disabled!`);

                const embeds = [ new MessageEmbed()
                    .setColor(colors.PaleBlue)
                    .setDescription(`Enabled the command \`${input}\``)
                    .setFooter('It might take some time wchanges apply!') ];
            
                disabledCommands.splice(disabledCommands.indexOf(input), 1); // Set
                await message.channel.send({ embeds });
                writeJSONSync('./botSettings.json', data, { spaces: 4 }); 
                break;
            }

            case 'disable': {
                if (!bot.commands.get(input)) return message.channel.send(`There's not such command as \`${input}\`!`);
                if (disabledCommands.includes(input)) return message.channel.send(`The command \`${input}\` is already disabled!`);

                const embeds = [ new MessageEmbed()
                    .setColor(colors.OrangeRed)
                    .setDescription(`Disabled the command \`${input}\``)
                    .setFooter('It might take some time changes apply!') ];

                disabledCommands.push(input); // Set
                await message.channel.send({ embeds });
                writeJSONSync('./botSettings.json', data, { spaces: 4 }); 
                break;
            }

            case 'list':
            case undefined: {
            /** @param {boolean} elem */
                const formatBool = (elem) => elem ? 'Enabled' : 'Disabled';

                const embeds = [ new MessageEmbed()
                    .setColor(colors.ForestGreen)
                    .setDescription(
                        stripIndents`Welcomer: \`${formatBool(data.welcomer)}\`
                Blacklisting: \`${formatBool(data.blacklisting)}\`
                Blacklisting logs: \`${formatBool(data.blacklistLogs)}\`
                Autoresponders: \`${formatBool(data.autoresponders)}\`
                Disabled commands: \`${data.disabledCommands.length ? data.disabledCommands.join(', ') : 'None'}\`
                Disabled slash commands: \`${data.disabledInteractions.length ? data.disabledInteractions.join(', ') : 'None'}\``) ];

                message.channel.send({ embeds });
                break;
            }

            case 'reset': {
                let defaults = {
                    welcomer: true,
                    blacklisting: true,
                    blacklistLogs: true,
                    autoresponders: true,
                    disabledCommands: [],
                    disabledInteractions: []
                };
                if (data == defaults) return message.channel.send('The bot is already in its default settings!');
            
                const embeds = [ new MessageEmbed()
                    .setColor(colors.Maroon)
                    .setDescription('Resetting to defaults')
                    .setFooter('It might take some time while changes apply!') ];

                await message.channel.send({ embeds });
                writeJSONSync('./botSettings.json', defaults, { spaces: 4 });
                break;
            }
            case 'showblacklist':
            case 'showwords':
            case 'showbl': {
                const embeds = [ new MessageEmbed()
                    .setColor(colors.Red)
                    .setTitle('HOLD UP!')
                    .setDescription('This command will show **all** the blacklisted words **without censor**, and will then delete it after **30 seconds**. Don\'t use this carelessly. Are you sure you want to do this?.')
                    .setFooter('You have 30s to react') ];

                const components = [ new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('y')
                            .setLabel('Yes')
                            .setStyle('SUCCESS'),
                        new MessageButton()
                            .setCustomId('n')
                            .setLabel('No')
                            .setStyle('DANGER')
                    ) ];
                
                const msg = await message.channel.send({ embeds, components });
                const button = await promptButtons(msg, message.author.id, 30);
                if (button?.customId == 'y') {
                    const words = readJSONSync('./src/handlers/blacklisted-words.json', 'utf-8');
                    const format = (ws) => {
                        return ws.map(w => {
                            if (Array.isArray(w)) return w.join(' ');
                            else return w;
                        }).join(', ');
                    };
                    let res = stripIndents`\`\`\`diff
                    + JR34
                    ${format(words.jr34)}

                    + NSFW
                    ${format(words.nsfw)}

                    + Offensive
                    ${format(words.offensive)}
                    \`\`\``;

                    await button?.reply(res);
                    setTimeout(() => button?.deleteReply(), 30000);
                } else button?.reply({ content: 'Cancelled', ephemeral: true });
                break;
            }

            default: return message.channel.send('Invalid argument, please check the usage in the help command');
        }
    }
};