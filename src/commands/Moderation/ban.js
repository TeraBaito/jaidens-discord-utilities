const { Message, MessageEmbed, MessageButton, Permissions: { FLAGS: { BAN_MEMBERS } }, MessageActionRow } = require('discord.js');
const Bot = require('../../../Bot');
const colors = require('../../../colors.json');
const { promptButtons, getMember } = require('../../handlers/functions');

module.exports = {
    name: 'ban',
    aliases: ['b'],
    usage: 'ban [user] (reason)',
    description: 'Bans a member from the current guild',
    staffOnly: true,

    /** 
     * @param {Bot} bot 
     * @param {Message} message 
     * @param {string[]} args 
     */
    run: async(bot, message, args) => {
        // No args
        if (!args[0]) return message.channel.send('Please provide a user to ban')
            .then(m => setTimeout(() => { m.delete(); }, 5000));

        const logChannel = message.guild.channels.cache.find(c => c.name === 'ari-bot-logs') || message.channel;
        const toBan = await getMember(message, args[0]);
        
        if(message.deletable) message.delete();

        // No bot permissions to ban (it does by default)
        if (!message.guild.me.permissions.has(BAN_MEMBERS)) {
            return message.channel.send('I don\'t have permissions to ban members, please enable them').then(m => setTimeout(() => { m.delete(); }, 5000));
        }

        // No member found
        if (!toBan) return message.channel.send('Couldn\'t find that member, try again')
            .then(m => setTimeout(() => { m.delete(); }, 5000));

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

        const components = [ new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('y')
                    .setLabel('Yes')
                    .setStyle('SUCCESS'),
                new MessageButton()
                    .setCustomId('n')
                    .setLabel('No')
                    .setStyle('DANGER')
            ) ];

        const msg = await message.channel.send({ embeds: [promptEmbed], components });
        const button = await promptButtons(msg, message.author.id, 30);
        
        if (button?.customId == 'y') {
            toBan.ban({ reason: args.slice(1).join(' ') })
                .catch(__ => button?.reply({ content: 'Well... something went wrong', ephemeral: true }));
            logChannel.send({ embeds: [bEmbed] });
            button?.reply(`**${toBan}** has been banned.`);
        } else button?.reply('Ban cancelled.');
    }
};