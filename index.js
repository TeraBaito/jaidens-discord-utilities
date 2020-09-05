// Modules
const Discord = require('discord.js');
const { config } = require('dotenv');
const fs = require('fs');
const bot = new Discord.Client();

// Collections
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
bot.categories = fs.readdirSync('./commands/');

// Connect to VPS
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Working'));
app.listen(port, () => console.log(`Toucan listening at http://localhost:${port}`));

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