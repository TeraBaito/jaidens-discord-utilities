const Interaction = require('../../../Interaction');
const { MessageEmbed } = require('discord.js');
const { time } = require('@discordjs/builders');
const colors = require('../../../colors.json');

module.exports = new Interaction((bot, interaction) => {
    const member = interaction.options.get('user')?.member ?? interaction.member;

    let roles = [
        ...member.roles.cache
            .filter(r => r.id !== interaction.guild.id)
            .values()
    ].join(' ')  || 'None';

    // If the embed is more than 1024 chars it will error
    if (roles.length > 650) roles = 'Too much roles to show!';

    // Discord creation and server join date
    const created = time(member.user.createdAt),
        joined = time(member.joinedAt);

    // Embed
    const embeds = [ new MessageEmbed()
        .setDescription('**User Information**')
        .setFooter(member.displayName)
        .setThumbnail(member.user.displayAvatarURL())
        .setColor(colors.PaleBlue)
        .addField('Display Name', member.displayName)
        .addField('Username', member.user.tag)
        .addField('User ID', member.user.id)
        .addField('Joined Discord On', created)
        .addField('Joined Server On', joined)
        .addField('Roles Count', member.roles.cache.size.toString())
        .addField('Roles', roles, true) ];

    interaction.reply({ embeds });
})
    .setName('user')
    .setDescription('Shows general information of a member')
    .addUserOption(u => u
        .setName('user')
        .setDescription('Optional user to show information of')
    );