const Discord = require('discord.js');

module.exports = {
    name: 'addrole',
    helpName: 'Add Role',
    category: 'Configuration & Management',
    aliases: ['grant', 'give-role'],
    // cooldown: ,
    usage: 'add-role [user] [role]',
    description: 'Gives a role to a specified member. Be sure that the role exists so it can be granted!',

    run: async(bot, message, args) => {
        let role = message.guild.roles.cache.find(r => r.name.toLowerCase() === args[1]) || message.guild.roles.cache.find(r => r.id === args[1]) || message.mentions.roles.first();
        let toGiveRole = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        let logChannel = message.guild.channels.cache.find(c => c.name.toLowerCase() === 'toucan-logs') || message.channel;


        // Putting the embed up here so it doesn't error bc of hoisting
        let rEmbed = new Discord.MessageEmbed()
            .setColor(role.id.hexColor || '#293749')
            .setDescription('**Added Role to User**')
            .setTimestamp()
            .addField('Added to', `${toGiveRole} (${toGiveRole.id})`)
            .addField('Added by:', `${message.author} ${message.author.id}`); 
        

        // User can't give roles
        if (!message.member.hasPermission('MANAGE_ROLES')) {
            message.channel.send('You don\'t have permissions to give roles to other members')
                .then(m => m.delete({timeout: 5000}));
        }

        // Bot doesn't have permission to give roles (it does by default)
        if (!message.guild.me.hasPermission('MANAGE_ROLES')) {
            message.channel.send('I don\'t have permissions to give roles to a member, please enable the "Manage Roles" permission')
                .then(m => m.delete({timeout: 5000}));
        }

        // No such role found
        if (!role) {
            message.channel.send('Didn\'t quite find the role, are you sure you made it?')
                .then(m => m.delete({timeout: 5000}));
        }

        // User already has role
        if (toGiveRole.roles.cache.has(role.id)) {
            message.channel.send('I\'m not giving a role to someone that already has it...')
                .then(m => m.delete({timeout: 5000}));

        } else {
            await toGiveRole.roles.add(role.id);
            message.channel.send(`Succesfully gave the role ${role} to ${toGiveRole.displayName}!`);
            logChannel.send(rEmbed);
        }
    }
};