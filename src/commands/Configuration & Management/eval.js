const { Message, MessageEmbed } = require('discord.js');
const Bot = require('../../../index');
const beautify = require('beautify');
const { ownerID } = require('../../../config.json');
const colors = require('../../../colors.json');


module.exports = {
    name: 'eval',
    helpName: 'Evaluate',
    hidden: true,
    usage: 'eval [string]',
    description: 'Evaluates JavaScript code inputed from args.\nOnwer Only Command\nSelfnote: don\'t use this next to many people idk they could take your token i guess lmao',
    
    /** 
     * @param {Bot} bot 
     * @param {Message} message 
     * @param {string[]} args 
     */
    run: async(bot, message, args) => {
        if (message.author.id !== ownerID) {
            return message.channel.send('No dude. I don\'t want anyone but my master mess with code in the bot...')
                .then(m => setTimeout(() => { m.delete(); }, 5000));
        }

        if (!args[0]) { 
            return message.channel.send('Give me something to evaluate tho')
                .then(m => setTimeout(() => { m.delete(); }, 5000));
        }

        try {
            if (args.join(' ').toLowerCase().includes('token')) return message.channel.send('oh nononono you\'re not getting the token you\'re NOT GETTING IT IDNFIABGDJDNWIKG');

            const toEval = args.join(' ');
            const evaluated = eval(toEval);

            let embed = new MessageEmbed()
                .setColor(colors.ForestGreen)
                .setTimestamp()
                .setTitle('Eval')
                .addField('To Evaluate', `\`\`\`js\n${beautify(toEval, { format: 'js' })}\n\`\`\``)
                .addField('Evaluated', evaluated)
                .addField('Type of', typeof(evaluated))
                .setFooter(bot.user.username, bot.user.displayAvatarURL);

            message.channel.send(embed);
        } catch (e) {
            let embed = new MessageEmbed()
                .setColor(colors.Red)
                .setTitle('Error')
                .setDescription(e)
                .setFooter(bot.user.username, bot.user.displayAvatarURL);

            message.channel.send(embed);
        }
    }
};