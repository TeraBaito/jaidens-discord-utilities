const { Sequelize } = require('sequelize');

const tagsDB = new Sequelize({
        dialect: 'sqlite',
        logging: false,
        storage: 'db/tags.sqlite',
    }),

    suggestionsDB = new Sequelize({
        dialect: 'sqlite',
        logging: false,
        storage: 'db/suggestions.sqlite',
    });

module.exports = { tagsDB, suggestionsDB };