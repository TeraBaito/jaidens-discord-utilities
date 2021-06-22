const { Message, MessageEmbed } = require('discord.js');
const Bot = require('../../../index');
const colors = require('../../../colors.json');
const { promptMessage, getMember } = require('../../handlers/functions');

module.exports = {
    name: 'ban',
    aliases: ['b'],
    usage: 'ban [user]',
    description: 'Bans a member from the current guild',
    staffOnly: true,

    /** 
     * @param {Bot} bot 
     * @param {Message} message 
     * @param {string[]} args 
     */
    run: async(bot, message, args) => {
        const logChannel = message.guild.channels.cache.find(c => c.name === 'ari-bot-logs') || message.channel;
        const toBan = getMember(message, args[0]);
        
        if(message.deletable) message.delete();

        // Checks of when using command
        
        // No args
        if (!args[0]) {
            return message.channel.send('Please provide a user to ban').then(m => setTimeout(() => { m.delete(); }, 5000));
        }

        // No bot permissions to ban (it does by default)
        if (!message.guild.me.hasPermission('BAN_MEMBERS')) {
            return message.channel.send('I don\'t have permissions to ban members, please enable them').then(m => setTimeout(() => { m.delete(); }, 5000));
        }

        // No member found
        if (!toBan) {
            return message.channel.send('Couldn\'t find that member, try again').then(m => setTimeout(() => { m.delete(); }, 5000));
        }

        // Can't ban yourself (BRUH moment)
        if (message.author.id === toBan.id) {
            return message.channel.send('You can\'t ban yourself, what the actual FUCK are you doing???');
        }

        // User not bannable
        if (!toBan.bannable) {
            return message.channel.send('I can\'t ban that user due to role hierarchy, I guess').then(m => setTimeout(() => { m.delete(); }, 5000));
        } 
     
        // Log
        const bEmbed = new MessageEmbed()
            .setColor(colors.Orange)
            .setThumbnail(toBan.user.displayAvatarURL)
            .setFooter(message.member.displayName)
            .setTimestamp()
            .setDescription('**Ban Action**')
            .addField('Banned member', `${toBan} (${toBan.id})`)
            .addField('Banned by', `${message.author} (${message.author.id})`);

        // Add field if reason or if not reason
        if (!args[1]) {
            bEmbed.addField('Reason', 'No reason specified');
        } else {
            bEmbed.addField('Reason', args.slice(1).join(' '));
        }
            
        // Ban Verification
        const promptEmbed = new MessageEmbed()
            .setColor('eb8334')
            .setFooter('This verification becomes invalid after 30 seconds')
            .setDescription(`Do you want to ban ${toBan}?`); 

        message.channel.send(promptEmbed).then(async msg => {
            const emoji = await promptMessage(msg, message.author, 30, ['✅', '❌']);
            
            if (emoji === '✅') {
                msg.delete();

                toBan.ban(args.slice(1).join(' '))
                    .catch(err => {
                        if(err) return message.channel.send('Well... something went wrong');
                    });
                logChannel.send(bEmbed);
                message.channel.send(`**${toBan}** has been banned.`);

            } else if (emoji === '❌') {
                msg.delete();
                message.channel.send('Ban cancelled.');
            }
        });
    }
};