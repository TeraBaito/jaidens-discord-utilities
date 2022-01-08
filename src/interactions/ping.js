const { stripIndents } = require('common-tags');
const Interaction = require('../../Interaction');

module.exports = new Interaction(async (bot, interaction) => {
    const msg = await interaction.deferReply({ fetchReply: true });
    await interaction.editReply(stripIndents`Pong!
        Latency: ${Math.floor(msg.createdAt - interaction.createdAt)}ms
        Discord API Latency: ${bot.ws.ping}ms`);
})
    .setName('ping')
    .setDescription('Shows the bot uptime');