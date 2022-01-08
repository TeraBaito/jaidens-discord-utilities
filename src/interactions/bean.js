const Interaction = require('../../Interaction');

module.exports = new Interaction((bot, interaction) => {
    const user = interaction.options.get('user');
    if (user) interaction.reply(`<@!${user.value}> was beaned!`);
    else interaction.reply('You got some beans and ate them with your rice, ah yes...');
})
    .setName('bean')
    .setDescription('Bean a user, you have to try it and see')
    .addUserOption(opt => opt
        .setName('user')
        .setDescription('The user you\'ll throw beans at')
    );

