const { Message, MessageEmbed } = require('discord.js');
const Bot = require('../../../index');
const colors = require('../../../colors.json');
const { getMember } = require('../../handlers/functions');


module.exports = {
    name: 'unmute',
    aliases: ['um'],
    usage: 'unmute [user] (reason)',
    description: 'Unmutes an already muted member from the guild.\n**Attention:** The muterole has to be called "Muted", and the log channel #toucan-logs',
    staffOnly: true,

    /** 
     * @param {Bot} bot 
     * @param {Message} message 
     * @param {string[]} args 
     */
    run: async(bot, message, args) => {
        // No args
        if (!args[0]) {
            return message.channel.send('Please provide a user to unmute').then(m => setTimeout(() => { m.delete(); }, 5000));
        }

        const logChannel = message.guild.channels.cache.find(c => c.name === 'ari-bot-logs') || message.channel;
        const toUnmute = getMember(message, args[0]);
        const muterole = message.guild.roles.cache.find(r => r.name === 'Muted');

        // Bot doesn't have perms to mute (it does by default)
        if (!message.guild.me.hasPermission('MANAGE_ROLES')) {
            return message.channel.send('I don\'t have permissions to unmute users, please enable the "Manage Roles" permission')
                .then(m => setTimeout(() => { m.delete(); }, 5000));

        }

        // No user provided (no arguments)
        if (!args[0]) {
            return message.channel.send('Please provide a valid user to unmute')
                .then(m => setTimeout(() => { m.delete(); }, 5000));

        }
    
        // Can't find member
        if (!toUnmute) {
            return message.channel.send('Couldn\'t find that member, try again')
                .then(m => setTimeout(() => { m.delete(); }, 5000));
        }

        // Can't unmute yourself
        if (message.author.id === toUnmute.id) {
            return message.channel.send('Wait...why are you trying to unmute yourself?');
        }

        const umEmbed = new MessageEmbed()
            .setColor(colors.Orange)
            .setThumbnail(toUnmute.user.displayAvatarURL)
            .setFooter(message.member.displayName)
            .setTimestamp()
            .setDescription('**Unmute Action**')
            .addField('Unmuted member', `${toUnmute} (${toUnmute.id})`)
            .addField('Unmuted by', `${message.author} (${message.author.id})`);

        // Add field if reason or if not reason
        if (!args[1]) {
            umEmbed.addField('Reason', 'No reason specified');
        } else {
            umEmbed.addField('Reason', args.slice(1).join(' '));
        }

        if (!toUnmute.roles.cache.find(r => r.name === 'Muted')) {
            return message.channel.send('This person isn\'t muted, why would I unmute them?')
                .then(m => setTimeout(() => { m.delete(); }, 5000));
        } else {
            toUnmute.roles.remove(muterole.id)
                .catch(err => {
                    if(err) return message.channel.send('Well... something went wrong');
                });
                    
            logChannel.send(umEmbed);
            message.channel.send(`**${toUnmute}** has been unmuted.`);
        }
    }
};