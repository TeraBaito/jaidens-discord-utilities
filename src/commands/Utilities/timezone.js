const { Message } = require('discord.js');
const moment = require('moment-timezone');
const Bot = require('../../../Bot');

module.exports = {
    name: 'timezone',
    helpName: 'Timezone Converter',
    usage: 'timezone [tzname] (hour or date)',
    description: 'Convert timezones',

    /** 
     * @param {Bot} bot 
     * @param {Message} message 
     * @param {string[]} args 
     */
    run: async (bot, message, args) => {
        let timeZone = null;
        
        if (moment.tz.names().includes(args[0])) timeZone = args[0];
        else if (Number(args[0]) >= -11 && Number(args[0]) <= +14) timeZone = Number(args[0]);
        else return message.channel.send('Invalid timezone provided, use one provided from <https://en.wikipedia.org/wiki/List_of_tz_database_time_zones>, or an offset number from -11 to +14');

        let converted = null;
        if (args[1] && new Date(args.slice(1).join(' ')) === 'Invalid Date') return message.channel.send('Invalid date provided.');
        else if (args[1]) inputDate = converted = convert(new Date(args.slice(1).join(' ')));
        else converted = convert();

        const msg = `Current time in \`${typeof timeZone == 'number' ? `UTC${timeZone >= 0 ? '+' : ''}${timeZone}` : timeZone}\`:
${converted}`;
        message.channel.send(msg);

        function convert(d = new Date()) {
            const format = {
                dateStyle: 'medium',
                timeStyle: 'short'
            };
            
            if (typeof timeZone == 'number') {
                d.setHours(d.getHours() + timeZone);
                return d.toLocaleString(undefined, format);
            } else {
                return d.toLocaleString(undefined, Object.assign(format, { timeZone }));
            }
        }
    }
};