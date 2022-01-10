const Interaction = require('../../../Interaction');
const moment = require('moment-timezone');

module.exports = new Interaction((bot, interaction) => {
    let tz, converted, date;
    const format = {
        dateStyle: 'medium',
        timeStyle: 'short'
    };
    const convertN = (d = new Date()) => { 
        d.setHours(d.getHours() + d.getTimezoneOffset() / 60 + tz);
        return d.toLocaleString(undefined, format);
    };
    const convertS = (d = new Date()) => {
        format.timeZone = tz;
        return d.toLocaleString(undefined, format);
    };

    switch (interaction.options.getSubcommand()) {
        case 'number': {
            tz = interaction.options.get('offset').value;
            if (tz < -11 || tz > 14) return interaction.reply({
                content: 'Invalid offset provided, make sure it\'s a number between -11 and +14',
                ephemeral: true
            });

            date = interaction.options.get('date')?.value ?? new Date();
            if (new Date(date) === 'Invalid Date') return interaction.reply({
                content: 'Invalid date provided, please use a format from <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse#using_date.parse>',
                ephemeral: true
            });

            converted = convertN(new Date(date));
            interaction.reply(`${date == Date.now() ? 'Current' : 'Inputted'} time in \`UTC${tz >= 0 ? '+' : ''}${tz}\`:
${converted}`);
            break;
        }
        case 'string': {
            tz = interaction.options.get('offset').value;
            date = interaction.options.get('date')?.value ?? new Date();

            if (!moment.tz.names().includes(tz)) return interaction.reply({
                content: 'Invalid timezone provided, please use one from <https://en.wikipedia.org/wiki/List_of_tz_database_time_zones>',
                ephemeral: true
            });
    
            if (new Date(date) === 'Invalid Date') return interaction.reply({
                content: 'Invalid date provided, please use a format from <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse#using_date.parse>',
                ephemeral: true
            });

            converted = convertS(new Date(date));
            interaction.reply(`Current time in \`${tz}\`:
${converted}`);
            break;
        }
    }
})
    .setName('timezone')
    .setDescription('Converts timezones to a string offset, or a numeric one from -11 to +14')
    .addSubcommand(sub => sub
        .setName('number')
        .setDescription('Conversion with a numeric offset')
        .addIntegerOption(n => n
            .setName('offset')
            .setDescription('The numeric offset')
            .setRequired(true)
        )
        .addStringOption(str => str
            .setName('date')
            .setDescription('A custom date and time')
        )
    )
    .addSubcommand(sub => sub
        .setName('string')
        .setDescription('Conversion with a string offset, see wikipedia.org/wiki/List_of_tz_database_time_zones')
        .addStringOption(str => str
            .setName('offset')
            .setDescription('The offset')
            .setRequired(true)
        )
        .addStringOption(str => str
            .setName('date')
            .setDescription('A custom date and time')
        )
    );