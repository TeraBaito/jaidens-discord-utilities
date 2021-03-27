// Modules
const Discord = require('discord.js');
require('dotenv').config({ path: './.env'});
const fs = require('fs');
const chalk = require('chalk');

// Client
const bot = new Discord.Client({
    fetchAllMembers: true,
    ws: {
        intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_VOICE_STATES', 'GUILD_MESSAGE_REACTIONS']
    }
});

// Other bot properties
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
bot.categories = fs.readdirSync('./src/commands/');

// Debugging
//bot.on('raw', console.log);
//bot.on('debug', m => console.log(`${chalk.cyan('[Debug]')} - ${m}`));
bot.on('rateLimit', console.warn(`${chalk.yellow('[Ratelimit]')} - ${w}`));
bot.on('warn', w => console.warn(`${chalk.yellow('[Warn]')} - ${w}`));
bot.on('error', e => console.error(`${chalk.redBright('[Error]')} - ${e.stack}`));
process.on('uncaughtException', e => console.error(`${chalk.redBright('[Error]')} - ${e.stack}`));
process.on('unhandledRejection', e => console.error(`${chalk.redBright('[Error]')} - ${e.stack}`));
process.on('warning', e => console.warn(`${chalk.yellow('[Error]')} - ${e.stack}`));


// Handlers' modules
['command', 'event'].forEach(handler => {
    require(`./src/handlers/${handler}`)(bot);
});

// Connect to VPS
const express = require('express');
const app = express();
const port = 3000;
app.get('/', (req, res) => res.send('<p style="font-family:Segoe UI; color:MediumSeaGreen">[Info] Working!</p>'));
app.listen(port, () => console.log(`Ari Bot listening at http://localhost:${port}`));

// Login and turn on (default is DISCORD_TOKEN)
bot.login();