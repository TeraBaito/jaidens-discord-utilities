const { Message, MessageEmbed, MessageButton, Permissions: { FLAGS: { BAN_MEMBERS } } } = require('discord.js');
const Bot = require('../../../Bot');
const ms = require('ms');
const colors = require('../../../colors.json');
const { promptButtons, getMember } = require('../../handlers/functions');

module.exports = {
    name: 'tempban',
    aliases: ['tb'],
    usage: 'tempban [user] (reason)',
    description: 'Bans a user from the guild temporarily, for a specified amount of time (seconds, minutes, hours, days)',
    staffOnly: true,

    /** 
     * @param {Bot} bot 
     * @param {Message} message 
     * @param {string[]} args 
     */
    run: async(bot, message, args) => {
        // No args
        if (!args[0]) return message.channel.send('Please provide a user to tempban')
            .then(m => setTimeout(() => { m.delete(); }, 5000));

        const logChannel = message.guild.channels.cache.find(c => c.name === 'ari-bot-logs') || message.channel;
        const toTempban = await getMember(message, args[0]);
        let bantime = args[1];
        let reason = args[3] ? args.slice(2).join(' ') : 'No reason specified';

        if(message.deletable) message.delete();

        // No bot permissions to tempban (it does by default)
        if (!message.guild.me.permissions.has(BAN_MEMBERS)) return message.channel.send('I don\'t have permissions to tempban members, please enable them')
            .then(m => setTimeout(() => { m.delete(); }, 5000));

        // No member found
        if (!toTempban) return message.channel.send('Couldn\'t find that member, try again')
            .then(m => setTimeout(() => { m.delete(); }, 5000));

        // Can't tempban yourself xdd
        if (message.author.id === toTempban.id) return message.channel.send('You can\'t tempban yourself, just...no.');

        // User not bannable
        if (!toTempban.bannable) return message.channel.send('I can\'t tempban that user due to role hierarchy, I guess')
            .then(m => setTimeout(() => { m.delete(); }, 5000)); 
     
        // Log
        const bEmbed = new MessageEmbed()
            .setColor(colors.Orange)
            .setThumbnail(toTempban.user.displayAvatarURL)
            .setFooter(message.member.displayName)
            .setTimestamp()
            .setDescription('**Temporary Ban Action**')
            .addField('Banned member', `${toTempban} (${toTempban.id})`)
            .addField('Banned by', `${message.author} (${message.author.id})`)
            .addField('Ban time', ms(ms(bantime)))
            .addField('Reason', reason);

        const ubEmbed = new MessageEmbed()
            .setColor(colors.ForestGreen)
            .setFooter(message.member.displayName)
            .setTimestamp()
            .setDescription('**Unban Action**')
            .addField('Unbanned member', `${toTempban} (${toTempban.id})`)
            .addField('Reason', 'Automatic unban');

            
        // Tempban Verification
        const promptEmbed = new MessageEmbed()
            .setColor('eb8334')
            .setFooter('This verification becomes invalid after 30 seconds')
            .setDescription(`Do you want to tempban ${toTempban} for ${ms(ms(bantime))}?`);
     
        const components = [[
            new MessageButton()
                .setCustomId('y')
                .setLabel('Yes')
                .setStyle('SUCCESS'),
            new MessageButton()
                .setCustomId('n')
                .setLabel('No')
                .setStyle('DANGER')
        ]];
    
        const msg = await message.channel.send({ embeds: [promptEmbed], components });
        const button = await promptButtons(msg, message.author.id, 30);

        if (button?.customId == 'y') {
            toTempban.ban({ reason: args.slice(1).join(' ') })
                .catch(__ => button?.reply({ content: 'Well... something went wrong', ephemeral: true }));
            logChannel.send({ embeds: [bEmbed] });
            button?.reply(`**${toTempban}** has been banned for ${ms(ms(bantime))}.`);

            setTimeout(() => {
                try {
                    toTempban.guild.members.unban(toTempban, { reason });
                    logChannel.send({ embeds: [ubEmbed] });
                } catch(e) {
                    console.error(e);
                }
            }, ms(bantime));
        } else button?.reply('Tempban cancelled.');
    }
};