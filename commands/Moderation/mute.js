const Discord = require('discord.js');
const { promptMessage } = require('../../handlers/functions.js');

module.exports = {
    name: 'mute',
    helpName: 'Mute',
    category: 'Moderation',
    aliases: ['m'],
    // cooldown: ,
    usage: 'mute [user] (reason)',
    description: 'Mutes a member from the guild for an indefinite amount of time.\n**Attention:** The muterole has to be called "Muted", and the log channel #toucan-logs',

    run: async(bot, message, args) => {
        const logChannel = message.guild.channels.cache.find(c => c.name === 'ari-bot-logs') || message.channel;
        const toMute = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        const muterole = message.guild.roles.cache.find(r => r.name === 'Muted');

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

        // Member doesn't have perms to mute
        if (!message.member.hasPermission('KICK_MEMBERS', 'BAN_MEMBERS', 'MANAGE_ROLES')) {
            return message.channel.send('You don\'t have permissions to mute users, funny man')
                .then(m => m.delete({timeout: 5000}));
        }

        // Bot doesn't have perms to mute (it does by default)
        if (!message.guild.me.hasPermission('MANAGE_ROLES')) {
            return message.channel.send('I don\'t have permissions to mute users, please enable the "Manage Roles" permission')
                .then(m => m.delete({timeout: 5000}));

        }

        // No user provided (no arguments)
        if (!args[0]) {
            return message.channel.send('Please provide a valid user to mute')
                .then(m => m.delete({timeout: 5000}));

        }
    
        // Can't find member
        if (!toMute) {
            return message.channel.send('Couldn\'t find that member, try again')
                .then(m => m.delete({timeout: 5000}));
        }

        // Can't mute yourself
        if (message.author.id === toMute.id) {
            return message.channel.send('nOOOO don\'t try to mute yourself you\'re better than this :cri:');
        }

        // Member to mute has permissions to mute
        if (toMute.hasPermission('KICK_MEMBERS', 'BAN_MEMBERS', 'MANAGE_ROLES') && !message.member.hasPermission('ADMINISTRATOR')) {
            return message.channel.send('You can\'t mute a person that can mute you too, don\'t even bother...');
        }

        const mEmbed = new Discord.MessageEmbed()
            .setColor('#eb8334')
            .setThumbnail(toMute.user.displayAvatarURL)
            .setFooter(message.member.displayName)
            .setTimestamp()
            .setDescription('**Mute Action**')
            .addField('Muted member', `${toMute} (${toMute.id})`)
            .addField('Muted by', `${message.author} (${message.author.id})`);

        // Add field if reason or if not reason
        if (!args[1]) {
            mEmbed.addField('Reason', 'No reason specified');
        } else {
            mEmbed.addField('Reason', args.slice(1).join(' '));
        }

        const promptEmbed = new Discord.MessageEmbed()
            .setColor('eb8334')
            .setFooter('This verification becomes invalid after 30 seconds')
            .setDescription(`Do you want to mute ${toMute}?`);

        if (toMute.roles.cache.find(r => r.name === 'Muted')) {
            return message.channel.send('This person is already muted')
                .then(m => m.delete({timeout: 5000}));
        } else {
            toMute.roles.add(muterole.id)
                .catch(err => {
                    if(err) return message.channel.send('Well... something went wrong');
                });
                    
            logChannel.send(mEmbed);
            message.channel.send(`**${toMute}** has been muted.`);
        };
    }
};