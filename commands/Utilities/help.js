const Discord = require('discord.js'),
    { stripIndents } = require('common-tags'),
    { prefix } = require('../../config.json'),
    colors = require('../../colors.json');




module.exports = { 
    name: 'help',
    helpName: 'Help',
    category: 'Utilities',
    aliases: ['commands'],
    usage: 'help (command)',
    description: 'Shows list of commands',
    
    run: async (bot, message, args) => {

        if (args[0]) {
            return getCmd(bot, message, args[0]);
        } else {
            return getAll(bot, message);
        }
    }
};

function getAll(bot, message) {
    const embed = new Discord.MessageEmbed()
        .setColor(colors.Orange)
        .setFooter('Syntax: () = optional, [] = required, {a, b} = choose between a or b');
    
    const commands = (category) => {
        return bot.commands
            .filter(cmd => cmd.category === category)
            .map(cmd => `\`${cmd.name}\``)
            .join(' ');
    };

    const info = bot.categories 
        .map(cat => stripIndents`**${cat[0].toUpperCase() + cat.slice(1)}** \n\n${commands(cat)}`)
        .reduce((string, category) => string + '\n\n' + category);

    return message.channel.send(embed.setDescription(info));
}

function getCmd(bot, message, input) {
    const embed = new Discord.MessageEmbed()
        .setColor('#eb8334')
        .setFooter('Syntax: () = optional; [] = required; {a, b} = choose between a or b');

    const cmd = bot.commands.get(input.toLowerCase()) || bot.commands.get(bot.aliases.get(input.toLowerCase()));

    if(!cmd) {
        return message.channel.send(`**${input.toLowerCase()}** is not a command?`);
    }

    if(cmd.name) embed.setDescription(`**${cmd.helpName} Command**`);
    if(cmd.aliases) embed.addField('**Aliases**', `${cmd.aliases.map(a => `\`${a}\``).join(' ')}`);
    if(cmd.description) embed.addField('**Command Description**', `${cmd.description}`);
    if(cmd.usage) embed.addField('**Command Structure**', `\`${prefix}${cmd.usage}\``);

    return message.channel.send(embed);
}