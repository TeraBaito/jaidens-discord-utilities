const Bot = require('../../index');
const ascii = require('ascii-table');
const { readdirSync } = require('fs');

let table = new ascii();
table.setHeading('Interaction', 'Status');

/**
 * Checks if a command has all what's needed for it to have. Return one string if it does, return other if it doesn't
 */
function checkData(bot, command, fileName) {
    const 
        success = '✔',  
        err =    '✖';

    const { name, description, run } = command;
    if (
        typeof name == 'string' &&
        typeof description == 'string' &&
        typeof run == 'function'
    ) {
        bot.interactions.set(command.name.toLowerCase(), command);
        return table.addRow(fileName, success);
    }
    return table.addRow(fileName, err);
}
/**
 * Requires and triggers a command from the ./interactions/ directory when it is inputed by a user next to the prefix.
 * Not included in this file but in `index.js`, but there also is a collection with all commands at the time of node.
 * If a user inputs a wrong command (incorrect command.name) it will not trigger anything.
 * @param {Bot} bot The bot as a Client object
 */
module.exports = bot => {
    const dirs = readdirSync('./src/interactions', { withFileTypes: true })
        .filter(d => d.isDirectory())
        .map(d => d.name);

    for (const dir of dirs) {
        for (const file of readdirSync('./src/interactions/' + dir)) {
            const pull = require(`../interactions/${dir}/${file}`);
            checkData(bot, pull, file);
        }
    }
    console.log(table.toString());
};