// Modules
const Discord = require('discord.js');
const { config } = require('dotenv');
const fs = require('fs');
const bot = new Discord.Client();

// Collections
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
bot.categories = fs.readdirSync('./commands/');

// for event (yea i used the bot to add things shUt)
bot.event = {
    members: new Set(),
    started: false,
    guildID: '754451472699228281', // SELF-REMINDER: change to '754451472699228281'
    vcID: '775882323597983744', // SELF-REMINDER: change to '775882323597983744'
    announceID: '776174736778461204', // SELF-REMINDER: change to '776174736778461204'
    startTimestamp: Date, // make it Date.now() when you call it
    endTimestamp: Date // make it Date.now() when you call it
};
bot.event.startTimestamp;
bot.event.endTimestamp;

// Connect to VPS
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Working'));
app.listen(port, () => console.log(`Ari Bot listening at http://localhost:${port}`));

// ENV path
config({
    path: `${__dirname}/.env`
});

// Login and turn on
bot.login(process.env.TOKEN);


// Handlers' modules
['command', 'event'].forEach(handler => {
    require(`./handlers/${handler}`)(bot);
});