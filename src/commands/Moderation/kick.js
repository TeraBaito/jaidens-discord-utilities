const { Message, MessageEmbed, MessageButton, Permissions: { FLAGS: { KICK_MEMBERS } } } = require('discord.js');
const Bot = require('../../../Bot');
const colors = require('../../../colors.json');
const { promptButtons, getMember } = require('../../handlers/functions');
    

module.exports = {
    name: 'kick',
    aliases: ['k'],
    usage: 'kick [user] (reason)',
    description: 'Kicks a member from the current guild\n**Attention:** Log channel has to be called #toucan-logs, or else it will log it in the current channel.',
    staffOnly: true,

    /** 
     * @param {Bot} bot 
     * @param {Message} message 
     * @param {string[]} args 
     */
    run: async(bot, message, args) => {
        // No args
        if (!args[0]) return message.channel.send('Please provide a user to kick')
            .then(m => setTimeout(() => { m.delete(); }, 5000));

        const logChannel = message.guild.channels.cache.find(c => c.name === 'ari-bot-logs') || message.channel;
        const toKick = await getMember(message, args[0]);
        
        if(message.deletable) message.delete();

        // No bot permissions to kick (it does by default)
        if (!message.guild.me.permissions.has(KICK_MEMBERS)) return message.channel.send('I don\'t have permissions to kick members, please enable them')
            .then(m => setTimeout(() => { m.delete(); }, 5000));

        // No member found
        if (!toKick) return message.channel.send('Couldn\'t find that member, try again')
            .then(m => setTimeout(() => { m.delete(); }, 5000));

        // Can't kick yourself (bruh moment)
        if (message.author.id === toKick.id) return message.channel.send('You can\'t kick yourself, bruh moment');

        // User not kickable
        if (!toKick.kickable) return message.channel.send('I can\'t kick that user due to role hierarchy, I guess')
            .then(m => setTimeout(() => { m.delete(); }, 5000));

        // Embed
        const kEmbed = new MessageEmbed()
            .setColor(colors.Orange)
            .setThumbnail(toKick.user.displayAvatarURL)
            .setFooter(message.member.displayName)
            .setTimestamp()
            .setDescription('**Kick Action**')
            .addField('Kicked member', `${toKick} (${toKick.id})`)
            .addField('Kicked by', `${message.author} (${message.author.id})`);

            
        // Add field if reason or if not reason
        if (!args[1]) {
            kEmbed.addField('Reason', 'No reason specified');
        } else {
            kEmbed.addField('Reason', args.slice(1).join(' '));
        }           

        const promptEmbed = new MessageEmbed()
            .setColor('eb8334')
            .setFooter('This verification becomes invalid after 30 seconds')
            .setDescription(`Do you want to kick ${toKick}?`);

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

        if (button.customId == 'y') {
            toKick.kick(args.slice(1).join(' '))
                .catch(__ => button.reply({ content: 'Well... something went wrong', ephemeral: true }));
            
            logChannel.send({ embeds: [kEmbed] });
            button.reply(`**${toKick}** has been kicked.`);
        } else button.reply('Kick cancelled.');
    }
};