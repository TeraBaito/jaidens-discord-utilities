const Discord = require('discord.js');
const colors = require('../../../colors.json');
const { getMember } = require('../../handlers/functions');

module.exports = {
    name: 'addrole',
    helpName: 'Add Role',
    category: 'Configuration & Management',
    aliases: ['grant', 'give-role'],
    // cooldown: ,
    usage: 'addrole [user] [role]',
    description: 'Gives a role to a specified member. Be sure that the role exists so it can be granted!',

    /** 
     * @param {Discord.Client} bot 
     * @param {Discord.Message} message 
     * @param {Array} args 
     */
    run: async(bot, message, args) => {
        let role = message.guild.roles.cache.find(r => r.name.toLowerCase() === args[1].toLowerCase()) || message.guild.roles.cache.find(r => r.id === args[1]) || message.mentions.roles.first();
        let toGiveRole = getMember(message, args[0]);
        let logChannel = message.guild.channels.cache.find(c => c.name.toLowerCase() === 'ari-bot-logs') || message.channel;

        if(message.deletable) message.delete();

        // Putting the embed up here so it doesn't error bc of hoisting
        let rEmbed = new Discord.MessageEmbed()
            .setColor(role.hexColor !== colors.Black ? role.hexColor : colors.PaleBlue)
            .setDescription('**Added Role to User**')
            .setTimestamp()
            .addField('Added to', `${toGiveRole} (${toGiveRole.id})`)
            .addField('Added by:', `${message.author} ${message.author.id}`); 
        

        // User can't give roles
        if (!message.member.hasPermission('MANAGE_ROLES')) {
            message.channel.send('You don\'t have permissions to give roles to other members')
                .then(m => setTimeout(() => { m.delete(); }, 5000));
        }

        // Bot doesn't have permission to give roles (it does by default)
        if (!message.guild.me.hasPermission('MANAGE_ROLES')) {
            message.channel.send('I don\'t have permissions to give roles to a member, please enable the "Manage Roles" permission')
                .then(m => setTimeout(() => { m.delete(); }, 5000));
        }

        // No such role found
        if (!role) {
            message.channel.send('Didn\'t quite find the role, are you sure you made it?')
                .then(m => setTimeout(() => { m.delete(); }, 5000));
        }

        // User already has role
        if (toGiveRole.roles.cache.find(r => r.id == role.id)) {
            message.channel.send('I\'m not giving a role to someone that already has it...')
                .then(m => setTimeout(() => { m.delete(); }, 5000));
        }
        
        await toGiveRole.roles.add(role.id);
        message.channel.send(`Succesfully gave the role **${role.name}** to ${toGiveRole.user.username}!`);
        logChannel.send(rEmbed);
    }
};