const Discord = require('discord.js');
const ascii = require('ascii-table');
const { readdirSync } = require('fs');


let table = new ascii();
table.setHeading('Command', 'Load Status');


/**
 * Checks if a command has all what's needed for it to have. Return one string if it does, return other if it doesn't
 */
function checkData(bot, command, fileName) {
    const 
        success = '✔   Loaded',  
        err =    '✖   Missing Data';

    const { name, helpName, category, usage, description, run } = command;
    if (
        typeof name == 'string' &&
        typeof helpName == 'string' &&
        typeof category == 'string' &&
        typeof usage == 'string' &&
        typeof description == 'string' &&
        typeof run == 'function'
    ) {
        bot.commands.set(command.name.toLowerCase(), command);
        table.addRow(fileName, success);
        return;
    }
    console.log(typeof command);
    return table.addRow(fileName, err);
}
/**
 * Requires and triggers a command from the ./commands/ directory when it is inputed by a user next to the prefix.
 * Not included in this file but in `index.js`, but there also is a collection with all commands at the time of node.
 * If a user inputs a wrong command (incorrect command.name or command.aliases) it will not trigger anything.
 * @param {Discord.Client} bot The bot as a Client object
 */
module.exports = bot => {
    readdirSync('./src/commands/').forEach(dir => {
        const commands = readdirSync(`./src/commands/${dir}/`).filter(file => file.endsWith('.js'));
        for (let file of commands) {
            let pull = require(`../commands/${dir}/${file}`);
            /*if (pull.name) {
                bot.commands.set(pull.name.toLowerCase(), pull);
                table.addRow(file, '✔   Loaded');
            } else {
                table.addRow(file, '✖   Not loaded -> missing a help.name, or help.name is not a string.');
                continue;
            }*/
            if (file == 'test2.js') console.log(pull);
            checkData(bot, pull, file);
            if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach(alias => bot.aliases.set(alias.toLowerCase(), pull.name.toLowerCase()));
        }
    });
    console.log(table.toString());
};