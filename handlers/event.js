const Discord = require('discord.js'),
    { readdirSync } = require('fs');

/**
 * Event handler
 * Requires and loads all events in the ./events/ directory with the correct parameters
 * @param {Discord.Client} bot The bot as a Client object
 */
module.exports = bot => {
    const load = dirs => {
        const events = readdirSync(`./events/${dirs}/`).filter(d => d.endsWith('.js'));
        for(let file of events) {
            const evt = require(`../events/${dirs}/${file}`);
            let eName = file.split('.')[0];
            bot.on(eName, evt.bind(null, bot));
        }
    };
    ['client', 'guild'].forEach(x=>load(x));
};