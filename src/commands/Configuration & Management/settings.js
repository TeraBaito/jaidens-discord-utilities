const { stripIndents } = require('common-tags');
const { Message, MessageEmbed } = require('discord.js');
const Bot = require('../../../index');
const { readJSONSync, writeJSONSync } = require('fs-extra');
const colors = require('../../../colors.json');
const { promptMessage } = require('../../handlers/functions');

module.exports = {
    name: 'settings',
    helpName: 'Bot Core Settings',
    aliases: ['botSettings', 'config', 'botConfig'],
    usage: 'settings {welcomer, blacklisting, list, reset}\na+settings {enable, disable} [command]\na+settings enable all',
    description: 'Enables and disables core settings of the bot, such as welcomer or specific commands.',
    staffOnly: true,

    /**
    * @param {Bot} bot
    * @param {Message} message
    * @param {string[]} args
    */
    run: async(bot, message, args) => {
        /**  @type {{ welcomer: boolean, blacklisting: boolean, blacklistLogs: boolean disabledCommands: string[] }} */
        const data = readJSONSync('./botSettings.json', 'utf-8');
        let { disabledCommands } = data;
        const input = args[1];

        /** @param {boolean} elem */
        const formatBool = (elem) => elem ? 'Enabled' : 'Disabled';

        switch(args[0]) {

            case 'welcomer':
            case 'announce':
            case 'welcome': {
                data.welcomer = !data.welcomer; // Set
                const embed = new MessageEmbed()
                    .setColor(colors.ForestGreen)
                    .setDescription(`\`${formatBool(data.welcomer)}\` welcomer settings`)
                    .setFooter('It might take some time while changes apply!');

                await message.channel.send(embed);
                writeJSONSync('./botSettings.json', data, { spaces: 4 });
                break;
            }

            case 'blacklisting':
            case 'blacklist': {
                data.blacklisting = !data.blacklisting; // Set
                const embed = new MessageEmbed()
                    .setColor(colors.ForestGreen)
                    .setDescription(`\`${formatBool(data.blacklisting)}\` blacklisting settings`)
                    .setFooter('It might take some time while changes apply!');

                await message.channel.send(embed);
                writeJSONSync('./botSettings.json', data, { spaces: 4 });
                break;
            }
            case 'blacklistlogs':
            case 'blacklistdebug': {
                data.blacklistLogs = !data.blacklistLogs; // Set
                const embed = new MessageEmbed()
                    .setColor(colors.ForestGreen)
                    .setDescription(`\`${formatBool(data.blacklistLogs)}\` blacklisting logs`)
                    .setFooter('It might take some time while changes apply!');

                await message.channel.send(embed);
                writeJSONSync('./botSettings.json', data, { spaces: 4 });
                break;
            }
            case 'autoresponders':
            case 'autoresponder': {
                data.autoresponders = !data.autoresponders; // Set
                const embed = new MessageEmbed()
                    .setColor(colors.ForestGreen)
                    .setDescription(`\`${formatBool(data.autoresponders)}\` autoresponders`)
                    .setFooter('It might take some time while changes apply!');

                await message.channel.send(embed);
                writeJSONSync('./botSettings.json', data, { spaces: 4 });
                break;
            }
            case 'enable': {
                if (input == 'all') {
                    disabledCommands.splice(0, disabledCommands.length);
                    await message.channel.send(
                        new MessageEmbed()
                            .setColor(colors.PaleBlue)
                            .setDescription('Enabled all previously disabled commands')
                            .setFooter('It might take some time changes apply!'));
                    writeJSONSync('./botSettings.json', data, { spaces: 4 });
                    return; 
                }

                if (!bot.commands.get(input)) return message.channel.send(`There's not such command as \`${input}\`!`);
                if (!disabledCommands.includes(input)) return message.channel.send(`The command \`${input}\` is not disabled!`);

                const embed = new MessageEmbed()
                    .setColor(colors.PaleBlue)
                    .setDescription(`Enabled the command \`${input}\``)
                    .setFooter('It might take some time wchanges apply!');
            
                disabledCommands.splice(disabledCommands.indexOf(input), 1); // Set
                await message.channel.send(embed);
                writeJSONSync('./botSettings.json', data, { spaces: 4 }); 
                break;
            }

            case 'disable': {
                if (!bot.commands.get(input)) return message.channel.send(`There's not such command as \`${input}\`!`);
                if (disabledCommands.includes(input)) return message.channel.send(`The command \`${input}\` is already disabled!`);

                const embed = new MessageEmbed()
                    .setColor(colors.OrangeRed)
                    .setDescription(`Disabled the command \`${input}\``)
                    .setFooter('It might take some time changes apply!');

                disabledCommands.push(input); // Set
                await message.channel.send(embed);
                writeJSONSync('./botSettings.json', data, { spaces: 4 }); 
                break;
            }

            case 'list':
            case undefined: {
            /** @param {boolean} elem */
                const formatBool = (elem) => elem ? 'Enabled' : 'Disabled';

                const embed = new MessageEmbed()
                    .setColor(colors.ForestGreen)
                    .setDescription(
                        stripIndents`Welcomer: \`${formatBool(data.welcomer)}\`
                Blacklisting: \`${formatBool(data.blacklisting)}\`
                Blacklisting logs: \`${formatBool(data.blacklistLogs)}\`
                Autoresponders: \`${formatBool(data.autoresponders)}\`
                Disabled commands: \`${data.disabledCommands.length ? data.disabledCommands.join(', ') : 'None'}\``);

                message.channel.send(embed);
                break;
            }

            case 'reset': {
                let defaults = {
                    welcomer: true,
                    blacklisting: true,
                    blacklistLogs: true,
                    autoresponders: true,
                    disabledCommands: []
                };
                if (data == defaults) return message.channel.send('The bot is already in its default settings!');
            
                const embed = new MessageEmbed()
                    .setColor(colors.Maroon)
                    .setDescription('Resetting to defaults')
                    .setFooter('It might take some time while changes apply!');

                await message.channel.send(embed);
                writeJSONSync('./botSettings.json', defaults, { spaces: 4 });
                break;
            }
            case 'showblacklist':
            case 'showwords':
            case 'showbl': {
                const embed = new MessageEmbed()
                    .setColor(colors.Red)
                    .setTitle('HOLD UP!')
                    .setDescription('This command will show **all** the blacklisted words **without censor**, and will then delete it after **30 seconds**. Don\'t use this carelessly. If you\'re sure what you\'re doing, react with the check.')
                    .setFooter('You have 30s to react');
                const msg = await message.channel.send(embed);
                const emoji = await promptMessage(msg, message.author, 30, '✅', '❌');
                if (emoji == '✅') {
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

                    message.channel.send(res)
                        .then(m => setTimeout(() => m.delete(), 30000));
                } else if (emoji == '❌') return message.channel.send('Cancelled.');
                break;
            }

            default: return message.channel.send('Invalid argument, please check the usage in the help command');
        }
    }
};