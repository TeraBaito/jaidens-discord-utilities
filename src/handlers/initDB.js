const { blue } = require('chalk');
const { argv: args } = process;
const { tagsDB, suggestionsDB } = require('./databases');

require('./models/Tags')(tagsDB);
require('./models/Suggestions')(suggestionsDB);


const force = args.includes('--force') || args.includes('-f'),
    val = args[2];

switch (val) {
    case 'tags':
    case 'tag':
    case 't':
        tagsDB.sync({ force, alter: true }).then(() => {
            console.log(blue('[DB]'), 'Tags synced',  force ? 'and reset' : '');
            tagsDB.close();
        }).catch(console.error);
        break;
    case 'suggestions':
    case 'suggestion':
    case 'suggest':
    case 's':
        suggestionsDB.sync({ force, alter: true }).then(() => {
            console.log(blue('[DB]'), 'Suggestions synced',  force ? 'and reset' : '');
            suggestionsDB.close();
        }).catch(console.error);
        break;
    default:
        console.error(blue('[DB]'), 'Invalid database type');
        break;
}