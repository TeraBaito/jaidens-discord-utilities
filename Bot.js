const { Client, Collection, Intents: { FLAGS } } = require('discord.js');
const { tagsDB, suggestionsDB } = require('./src/handlers/databases');
const { readdirSync } = require('fs');

const Bot = class extends Client {
    constructor() {
        super({
            intents: [
                FLAGS.GUILDS,
                FLAGS.GUILD_MESSAGES,
                FLAGS.GUILD_MEMBERS,
                FLAGS.GUILD_MESSAGE_REACTIONS
            ],
            partials: ['MESSAGE', 'USER', 'GUILD_MEMBER']
        });

        this.commands = new Collection();
        this.aliases = new Collection();
        this.afk = new Collection();
        this.categories = readdirSync('./src/commands');
        this.cooldowns = new Collection();
        this.tags = require('./src/handlers/models/Tags')(tagsDB);
        this.suggestions = require('./src/handlers/models/Suggestions')(suggestionsDB);
    }
};

module.exports = Bot;
