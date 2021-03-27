const { stripIndents } = require('common-tags');
const Discord = require('discord.js');
const { readJSONSync, writeJSONSync } = require('fs-extra');
const { checkStaff } = require('../../handlers/functions');
const colors = require('../../../colors.json');

module.exports = {
    name: 'settings',
    helpName: 'Bot Core Settings',
    category: 'Configuration & Management',
    aliases: ['botSettings', 'config', 'botConfig'],
    usage: 'settings {welcomer, blacklisting, list, reset}\na+settings {enable, disable} [command]\na+settings enable all',
    description: 'STAFF COMMAND ONLY\nEnables and disables core settings of the bot, such as welcomer or specific commands.',

    /**
    * @param {Discord.Client} bot
    * @param {Discord.Message} message
    * @param {Array} args
    */
    run: async(bot, message, args) => {
        let emot = '<:troll:798638733095075875>';
        if (!checkStaff(message.member)) return message.channel.send('You can\'t use this command; smh get admin lol rekt '+emot+emot+emot);

        /**  @type {{ welcomer: boolean, blacklisting: boolean, disabledCommands: string[] }} */
        const data = readJSONSync('./botSettings.json', 'utf-8');
        let { disabledCommands } = data;
        const input = args[1];

        /** @param {boolean} elem */
        const formatBool = (elem) => elem ? 'Enabled' : 'Disabled';

        switch(args[0]) {

        case 'welcomer':
        case 'announce':
        case 'welcome': {
            console.log(data);
            data.welcomer = !data.welcomer; // Set
            console.log(data);
            const embed = new Discord.MessageEmbed()
                .setColor(colors.ForestGreen)
                .setDescription(`\`${formatBool(data.welcomer)}\` welcomer settings`)
                .setFooter('It might take some time while I restart!');

            await message.channel.send(embed);
            writeJSONSync('./botSettings.json', data, { spaces: 4 });
            break;
        }

        case 'blacklisting':
        case 'blacklist': {
            console.log(data);
            data.blacklisting = !data.blacklisting; // Set
            console.log(data);
            const embed = new Discord.MessageEmbed()
                .setColor(colors.ForestGreen)
                .setDescription(`\`${formatBool(data.blacklisting)}\` blacklisting settings`)
                .setFooter('It might take some time while I restart!');

            await message.channel.send(embed);
            writeJSONSync('./botSettings.json', data, { spaces: 4 });
            break;
        }
        case 'enable': {
            if (input == 'all') {
                disabledCommands.splice(0, disabledCommands.length);
                await message.channel.send(
                    new Discord.MessageEmbed()
                        .setColor(colors.PaleBlue)
                        .setDescription('Enabled all previously disabled commands')
                        .setFooter('It might take some time while I restart!'));
                writeJSONSync('./botSettings.json', data, { spaces: 4 });
                return; 
            }

            if (!bot.commands.get(input)) return message.channel.send(`There's not such command as \`${input}\`!`);
            if (!disabledCommands.includes(input)) return message.channel.send(`The command \`${input}\` is not disabled!`);

            const embed = new Discord.MessageEmbed()
                .setColor(colors.PaleBlue)
                .setDescription(`Enabled the command \`${input}\``)
                .setFooter('It might take some time while I restart!');
            
            disabledCommands.splice(disabledCommands.indexOf(input), 1); // Set
            await message.channel.send(embed);
            writeJSONSync('./botSettings.json', data, { spaces: 4 }); 
            break;
        }

        case 'disable': {
            if (!bot.commands.get(input)) return message.channel.send(`There's not such command as \`${input}\`!`);
            if (disabledCommands.includes(input)) return message.channel.send(`The command \`${input}\` is already disabled!`);

            const embed = new Discord.MessageEmbed()
                .setColor(colors.OrangeRed)
                .setDescription(`Disabled the command \`${input}\``)
                .setFooter('It might take some time while I restart!');

            disabledCommands.push(input); // Set
            await message.channel.send(embed);
            writeJSONSync('./botSettings.json', data, { spaces: 4 }); 
            break;
        }

        case 'list': {
            /** @param {boolean} elem */
            const formatBool = (elem) => elem ? 'Enabled' : 'Disabled';

            const embed = new Discord.MessageEmbed()
                .setColor(colors.ForestGreen)
                .setDescription(
                    stripIndents`Welcomer: \`${formatBool(data.welcomer)}\`
                Blacklisting: \`${formatBool(data.blacklisting)}\`
                Disabled commands: \`${data.disabledCommands.length ? data.disabledCommands.join(', ') : 'None'}\``);

            message.channel.send(embed);
            break;
        }

        case 'reset': {
            let defaults = {
                welcomer: true,
                blacklisting: true,
                disabledCommands: []
            };
            if (data == defaults) return message.channel.send('The bot is already in its default settings!');
            
            const embed = new Discord.MessageEmbed()
                .setColor(colors.Maroon)
                .setDescription('Resetting to defaults')
                .setFooter('It might take some time while I restart!');

            await message.channel.send(embed);
            writeJSONSync('./botSettings.json', defaults, { spaces: 4 });
            break;
        }
        default: return message.channel.send('Invalid argument, please check the usage in the help command');
        }
    }
};