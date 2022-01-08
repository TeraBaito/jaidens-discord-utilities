const Interaction = require('../../Interaction');

module.exports = new Interaction((bot, interaction) => {
    interaction.reply('Unfortunately, Jaiden is not on this server, nor does she own any public server. However, this is the largest non-official fan server on Discord and you\'re welcome to stay!');
})
    .setName('no')
    .setDescription('No, Jaiden isn\'t here; you can still stay for the community however!');