// modules
const Discord = require('discord.js');
const { config } = require('dotenv');
const fs = require('fs');
const bot = new Discord.Client({
    disableEveryone: true
});

// env
config({
    path: `${__dirname}/.env`
});

// login and turn on
bot.login(process.env.TOKEN);

['event'].forEach(handler => {
    require(`./handlers/${handler}`)(bot);
});


