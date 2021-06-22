const { Message, MessageEmbed } = require('discord.js');
const Bot = require('../../../index');
const math = require('mathjs');
const colors = require('../../../colors.json');

module.exports = {
    name: 'math',
    aliases: ['calc', 'schoolpain'],
    usage: 'math [operation]',
    description: 'Evaluates a math operation. Please no quadratic equations or something lol',

    
    /** 
     * @param {Bot} bot 
     * @param {Message} message 
     * @param {string[]} args 
     */
    run: async(bot, message, args) => {
        if(!args[0]) return message.channel.send('Please ask a math question.');
 
        let resp;
        try {
            resp = math.evaluate(args.join(' '));
        } catch (e) {
            return message.channel.send('Please ask a valid math question.');
            
        }
       
       
        const embed = new MessageEmbed()
            .setColor(colors.Blue)
            .setTitle('Math')
            .addField('Question', `\`\`\`css\n${args.join('')}\`\`\``)
            .addField('Answer', `\`\`\`css\n${resp}\`\`\``);
       
        message.channel.send(embed);
    }
};