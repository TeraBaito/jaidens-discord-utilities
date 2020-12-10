const Discord = require('discord.js'),
    math = require('mathjs'),
    { stripIndents } = require('common-tags'),
    colors = require('../../../colors.json');

module.exports = {
    name: 'math',
    helpName: 'Math',
    category: 'Utilities',
    aliases: ['calc', 'schoolpain'],
    usage: 'math [operation]',
    description: 'Evaluates a math operation. Please no quadratic equations or something lol',
    run: async(bot, message, args) => {
        if(!args[0]) return message.channel.send('Please ask a math question.');
 
        let resp;
        try {
            resp = math.evaluate(args.join(' '));
        } catch (e) {
            return message.channel.send('Please ask a valid math question.');
            
        }
       
       
        const embed = new Discord.MessageEmbed()
            .setColor(colors.Blue)
            .setTitle('Math')
            .addField('Question', `\`\`\`css\n${args.join('')}\`\`\``)
            .addField('Answer', `\`\`\`css\n${resp}\`\`\``);
       
        message.channel.send(embed);
    }
};