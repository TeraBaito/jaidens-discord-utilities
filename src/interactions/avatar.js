const Interaction = require('../../Interaction');
const { MessageEmbed } = require('discord.js');
const colors = require('../../colors.json');

module.exports = new Interaction((bot, interaction) => {
    const member = interaction.options.get('user')?.member ?? interaction.member;
    const icon = member.user.displayAvatarURL({ format: 'png', size: 4096, dynamic: true });

    const embeds = [ new MessageEmbed()
        .setColor(colors.ForestGreen)
        .setDescription(`**${member.displayName}'s Avatar**`)
        .setImage(icon) ];
    
    interaction.reply({ embeds });
})
    .setName('avatar')
    .setDescription('Shows the profile picture of you or a specified user')
    .addUserOption(u => u
        .setName('user')
        .setDescription('Optional user to show profile picture of')
    );