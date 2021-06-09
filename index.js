// Modules
const { Client, Collection } = require('discord.js');
const { Sequelize } = require('sequelize');
require('dotenv').config({ path: './.env'});
const fs = require('fs');
const chalk = require('chalk');
const { stripIndents } = require('common-tags');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    logging: false,
    storage: 'db/database.sqlite',
});

const Bot = class extends Client {
    constructor() {
        super({
            fetchAllMembers: true,
            ws: {
                intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_VOICE_STATES', 'GUILD_MESSAGE_REACTIONS']
            }
        });

        this.commands = new Collection();
        this.aliases = new Collection();
        this.afk = new Collection();
        this.categories = fs.readdirSync('./src/commands');
        this.tags = require('./src/handlers/models/Tags')(sequelize);
    }
};
module.exports = Bot;

// Client
const bot = new Bot();

// Debugging
//bot.on('raw', console.log);
//bot.on('debug', m => console.log(`${chalk.cyan('[Debug]')} - ${m}`));
bot.on('rateLimit', rl => console.warn(
    stripIndents`${chalk.yellow('[Ratelimit]')}
    Timeout: ${rl.timeout}
    Limit: ${rl.limit}
    Route: ${rl.method} ${rl.route}`));
bot.on('warn', w => console.warn(`${chalk.yellow('[Warn]')} - ${w}`));
bot.on('error', e => console.error(`${chalk.redBright('[Error]')} - ${e.stack}`));
process.on('uncaughtException', e => console.error(`${chalk.redBright('[Error]')} - ${e.stack}`));
process.on('unhandledRejection', e => console.error(`${chalk.redBright('[Error]')} - ${e.stack}`));
process.on('warning', e => console.warn(`${chalk.yellow('[Error]')} - ${e.stack}`));


// Handlers' modules
['command', 'event'].forEach(handler => {
    require(`./src/handlers/${handler}`)(bot);
});

// Login and turn on (default is DISCORD_TOKEN)
bot.login();