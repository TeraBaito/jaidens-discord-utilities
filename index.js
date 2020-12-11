// Modules
const Discord = require('discord.js');
const { Player } = require('discord-player');
const { token } = require('./config.json');
const fs = require('fs');
const chalk = require('chalk');

// Client
const bot = new Discord.Client({
    fetchAllMembers: true,
    ws: {
        intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES']
    }
});

// Other bot properties
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
bot.categories = fs.readdirSync('./commands/');

// Debugging
//bot.on('debug', m => console.log(`[${chalk.cyan('debug')}] - ${m}`));
bot.on('warn', w => console.warn(`${chalk.yellow('[Warn]')} - ${w}`));
bot.on('error', e => console.error(`${chalk.redBright('[Error]')} - ${e.stack}`));
process.on('uncaughtException', e => console.error(`${chalk.redBright('[Error]')} - ${e.stack}`));
process.on('unhandledRejection', e => console.error(`${chalk.redBright('[Error]')} - ${e.stack}`));
process.on('warning', e => console.warn(`${chalk.yellow('[Error]')} - ${e.stack}`));

// Music Chunk
/*const player = new Player(bot);
bot.player = player;

bot.player
// Send a message when a track starts
    .on('trackStart', (message, track) => message.channel.send(`Now playing ${track.title}...`))
 
// Send a message when something is added to the queue
    .on('trackAdd', (message, track) => message.channel.send(`${track.title} has been added to the queue!`))
    .on('playlistAdd', (message, playlist) => message.channel.send(`${playlist.title} has been added to the queue (${playlist.items.length} songs)!`))
 
// Send messages to format search results
    .on('searchResults', (message, query, tracks) => {
 
        const embed = new Discord.MessageEmbed()
            .setAuthor(`Here are your search results for ${query}!`)
            .setDescription(tracks.map((t, i) => `${i + 1}. ${t.title}`))
            .setFooter('Send the number of the song you want to play!');
        message.channel.send(embed);
    })

    .on('searchInvalidResponse', (message, query, tracks, content, collector) => message.channel.send(`You must send a valid number between 1 and ${tracks.length}!`))
    .on('searchCancel', (message, query, tracks) => message.channel.send('You did not provide a valid response... Please send the command again!'))
    .on('noResults', (message, query) => message.channel.send(`No results found on YouTube for ${query}!`))
 
    // Send a message when the music is stopped
    .on('queueEnd', (message, queue) => message.channel.send('Music stopped as there is no more music in the queue!'))
    .on('channelEmpty', (message, queue) => message.channel.send('Music stopped as there is no more member in the voice channel!'))
    .on('botDisconnect', (message, queue) => message.channel.send('Music stopped as I have been disconnected from the channel!'))

    // Error handling
    .on('error', (error, message) => {
        switch(error.name){
        case 'NotPlaying':
            message.channel.send('There is no music being played on this server!');
            break;
        case 'NotConnected':
            message.channel.send('You are not connected in any voice channel!');
            break;
        case 'UnableToJoin':
            message.channel.send('I am not able to join your voice channel, please check my permissions!');
            break;
        default:
            message.channel.send(`Something went wrong... Error: ${error}`);
        }
    });*/

// Handlers' modules
['command', 'event'].forEach(handler => {
    require(`./handlers/${handler}`)(bot);
});

// Connect to VPS
const express = require('express');
const app = express();
const port = 3000;
app.get('/', (req, res) => res.send('<p style="font-family:Segoe UI; color:MediumSeaGreen">[Info] Working!</p>'));
app.listen(port, () => console.log(`Ari Bot listening at http://localhost:${port}`));


// Login and turn on
bot.login(token);