const Discord = require('discord.js');
const colors = require('../../../colors.json');

module.exports = {
    name: 'unban',
    helpName: 'Unban',
    category: 'Moderation',
    // aliases: [],
    usage: 'unban [ID]',
    description: 'Unbans a member from the current guild',

    /** 
     * @param {Discord.Client} bot 
     * @param {Discord.Message} message 
     * @param {Array} args 
     */
    run: async(bot, message, args) => {
        const logChannel = message.guild.channels.cache.find(c => c.name === 'ari-bot-logs') || message.channel;
        let reason = args.slice(1).join(' ');

        if(message.deletable) message.delete();

        // Checks of when using command
        
        // No args
        if (!args[0]) {
            return message.channel.send('Please provide a user to unban').then(m => setTimeout(() => { m.delete(); }, 5000));
        }       

        // No permissions to unban
        if (!message.member.hasPermission('BAN_MEMBERS', 'ADMINISTRATOR')) {
            return message.channel.send('You don\'t have permissions to unban members so...').then(m => setTimeout(() => { m.delete(); }, 5000));
        }

        // No bot permissions to ban (it does by default)
        if (!message.guild.me.hasPermission('BAN_MEMBERS', 'ADMINISTRATOR')) {
            return message.channel.send('I don\'t have permissions to unban members, please enable them').then(m => setTimeout(() => { m.delete(); }, 5000));
        }
        
        // Finding Nemo, I mean the banned user
        let toUnban;
        try {
            toUnban = await bot.users.fetch(args[0]);
        } catch(e) {
            message.channel.send('Couldn\'t find member').then(m => setTimeout(() => { m.delete(); }, 5000));
            return;
        }

        // why are you unbanning yourself
        if (message.author.id === toUnban.id) {
            return message.channel.send('But you typed this command, so you aren\'t banned??');
        }
        
        try {
            message.guild.members.unban(toUnban, { reason });
            message.channel.send(`**${toUnban.tag}** has been unbanned from the guild.`);
        } catch(e) {
            console.log(e);
        }
     
        // Log
        const ubEmbed = new Discord.MessageEmbed()
            .setColor(colors.ForestGreen)
            .setFooter(message.member.displayName)
            .setTimestamp()
            .setDescription('**Unban Action**')
            .addField('Unbanned member', `${toUnban} (${toUnban.id})`)
            .addField('Unbanned by', `${message.author} (${message.author.id})`);

        // Add field if reason or if not reason
        if (!args[1]) {
            ubEmbed.addField('Reason', 'No reason specified');
        } else {
            ubEmbed.addField('Reason', reason);
        }
            
        logChannel.send(ubEmbed);
    }
};