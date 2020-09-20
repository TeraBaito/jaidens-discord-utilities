const Discord = require('discord.js');
const { promptMessage } = require('../../handlers/functions.js');
const ms = require('ms');
const colors = require('../../colors.json');

module.exports = {
    name: 'tempban',
    helpName: 'Temporary Ban',
    category: 'Moderation',
    aliases: ['tb'],
    // cooldown: ,
    usage: 'tempban [user] (reason)',
    description: 'Bans a user from the guild temporarily, for a specified amount of time (seconds, minutes, hours, days)',

    run: async(bot, message, args) => {
        const logChannel = message.guild.channels.cache.find(c => c.name === 'ari-bot-logs') || message.channel;
        const toTempban = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        let bantime = args[1];
        let reason = args[3] ? args.slice(2).join(' ') : 'No reason specified';



        if(message.deletable) message.delete();

        // Checks of when using command
        
        // No args
        if (!args[0]) {
            return message.reply('Please provide a user to tempban').then(m => m.delete({timeout: 5000}));
        }

        

        // No permissions to tempban
        if (!message.member.hasPermission('BAN_MEMBERS')) {
            return message.reply('You don\'t have permissions to tempban members, smh').then(m => m.delete({timeout: 5000}));
        }

        // No bot permissions to tempban (it does by default)
        if (!message.guild.me.hasPermission('BAN_MEMBERS')) {
            return message.reply('I don\'t have permissions to tempban members, please enable them').then(m => m.delete({timeout: 5000}));
        }

        // No member found
        if (!toTempban) {
            return message.reply('Couldn\'t find that member, try again').then(m => m.delete({timeout: 5000}));
        }

        // Can't tempban yourself xdd
        if (message.author.id === toTempban.id) {
            return message.reply('You can\'t tempban yourself, just...no.');
        }

        // User not bannable
        if (!toTempban.bannable) {
            return message.reply('I can\'t tempban that user due to role hierarchy, I guess').then(m => m.delete({timeout: 5000}));
        }
        
        
     
        // Log
        const bEmbed = new Discord.MessageEmbed()
            .setColor(colors.Orange)
            .setThumbnail(toTempban.user.displayAvatarURL)
            .setFooter(message.member.displayName)
            .setTimestamp()
            .setDescription('**Temporary Ban Action**')
            .addField('Banned member', `${toTempban} (${toTempban.id})`)
            .addField('Banned by', `${message.author} (${message.author.id})`)
            .addField('Ban time', ms(ms(bantime)))
            .addField('Reason', reason);

        const ubEmbed = new Discord.MessageEmbed()
            .setColor(colors.ForestGreen)
            .setFooter(message.member.displayName)
            .setTimestamp()
            .setDescription('**Unban Action**')
            .addField('Unbanned member', `${toTempban} (${toTempban.id})`)
            .addField('Reason', 'Automatic unban');

        
            
        // Tempban Verification
        const promptEmbed = new Discord.MessageEmbed()
            .setColor('eb8334')
            .setFooter('This verification becomes invalid after 30 seconds')
            .setDescription(`Do you want to tempban ${toTempban} for ${ms(ms(bantime))}?`);
    
            
    
        message.channel.send(promptEmbed).then(async msg => {
            const emoji = await promptMessage(msg, message.author, 30, ['✅', '❌']);
                
            if (emoji === '✅') {
                msg.delete();
    
                toTempban.ban(args.slice(1).join(' '))
                    .catch(err => {
                        if(err) return message.channel.send('Well... something went wrong');
                    });
                logChannel.send(bEmbed);
                message.channel.send(`**${toTempban}** has been banned for ${ms(ms(bantime))}.`);

                setTimeout(() => {
                    try {
                        toTempban.guild.members.unban(toTempban, { reason });
                    } catch(e) {
                        console.log(e);
                    }
                    logChannel.send(ubEmbed);
                }, ms(bantime));
    
            } else if (emoji === '❌') {
                msg.delete();
                message.reply('Tempban cancelled.');
            }
        });
    }
};