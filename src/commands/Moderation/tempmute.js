const Discord = require('discord.js');
const ms = require('ms');
const colors = require('../../../colors.json');
const { getMember } = require('../../handlers/functions');


module.exports = {
    name: 'tempmute',
    helpName: 'Temporary Mute',
    category: 'Moderation',
    aliases: ['tm'],
    // cooldown: ,
    usage: 'tempmute [user] [time {s, m, h, d}] (reason)',
    description: 'Mutes a user from the guild temporarily, for a specified amount of time (seconds, minutes, hours, days)',

    /** 
     * @param {Discord.Client} bot 
     * @param {Discord.Message} message 
     * @param {Array} args 
     */
    run: async(bot, message, args) => {
        const logChannel = message.guild.channels.cache.find(c => c.name === 'ari-bot-logs') || message.channel;
        const toTempmute = getMember(message, args[0]);
        const muterole = message.guild.roles.cache.find(r => r.name === 'Muted');
        let mutetime = args[1];
        let reason = args[2] ? args.slice(2).join(' ') : 'No reason specified';


        // No muterole, creates a muterole :)
        if(!muterole) {
            try {
                muterole = await message.guild.createRole({
                    name: 'Muted',
                    color: '#800000',
                    permissions:[]
                });
                message.guild.channels.forEach(async (channel, id) => {
                    await channel.overwritePermissions(muterole, {
                        SEND_MESSAGES: false,
                        ADD_REACTIONS: false
                    });
                });
            } catch(e) {
                console.log(e.stack);
                message.channel.send('Well, something went wrong...');
            }
        }

        // Member doesn't have perms to tempmute
        if (!message.member.hasPermission('KICK_MEMBERS', 'BAN_MEMBERS', 'MANAGE_ROLES')) {
            return message.channel.send('You don\'t have permissions to tempmute users, funny man')
                .then(m => m.delete({timeout: 5000}));
        }

        // Bot doesn't have perms to tempmute (it does by default)
        if (!message.guild.me.hasPermission('MANAGE_ROLES')) {
            return message.channel.send('I don\'t have permissions to tempmute users, please enable the "Manage Roles" permission')
                .then(m => m.delete({timeout: 5000}));

        }

        // No user provided (no first argument)
        if (!args[0]) {
            return message.channel.send('Please provide a valid user to tempmute')
                .then(m => m.delete({timeout: 5000}));

        }
    
        // No time provided (no second argument)
        if (!mutetime) {
            return message.channel.send('Please provide a valid time argument to tempmute');
        }

        // Can't find member
        if (!toTempmute) {
            return message.channel.send('Couldn\'t find that member, try again')
                .then(m => m.delete({timeout: 5000}));
        }

        // Can't mute yourself
        if (message.author.id === toTempmute.id) {
            return message.channel.send('nOOOO don\'t try to mute yourself you\'re better than this :cri:');
        }

        // Member to tempmute has permissions to tempmute
        if (toTempmute.hasPermission('KICK_MEMBERS', 'BAN_MEMBERS', 'MANAGE_ROLES') && !message.member.hasPermission('ADMINISTRATOR')) {
            return message.channel.send('You can\'t tempmute a person that can tempmute you too, don\'t even bother...');
        }

        const mEmbed = new Discord.MessageEmbed()
            .setColor(colors.Orange)
            .setThumbnail(toTempmute.user.displayAvatarURL)
            .setFooter(message.member.displayName)
            .setTimestamp()
            .setDescription('**Temporary Mute Action**')
            .addField('Muted member', `${toTempmute} (${toTempmute.id})`)
            .addField('Muted by', `${message.author} (${message.author.id})`)
            .addField('Mute time', ms(ms(mutetime)))
            .addField('Reason', reason);

        const umEmbed = new Discord.MessageEmbed()
            .setColor(colors.ForestGreen)
            .setThumbnail(toTempmute.user.displayAvatarURL)
            .setFooter(message.member.displayName)
            .setTimestamp()
            .setDescription('**Unmute Action**')
            .addField('Unmuted member', `${toTempmute} (${toTempmute.id})`)
            .addField('Reason', 'Automatic unmute');


        if (toTempmute.roles.cache.find(r => r.name === 'Muted')) {
            return message.channel.send('This person is already muted')
                .then(m => m.delete({timeout: 5000}));
        } else {
            await(toTempmute.roles.add(muterole.id));
            message.channel.send(`${toTempmute} has been muted for ${ms(ms(mutetime))}`)
                .catch(err => {
                    if(err) return message.channel.send('Well... something went wrong');
                });
                    
            logChannel.send(mEmbed);
            

            setTimeout(() => {
                toTempmute.roles.remove(muterole.id);
                logChannel.send(umEmbed);
            }, ms(mutetime));
        };
    }
};