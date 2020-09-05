const Discord = require('discord.js');

module.exports = {
    name: 'removerole',
    helpName: 'Remove Role',
    category: 'Configuration & Management',
    // aliases: [],
    // cooldown: ,
    usage: 'removerole [user] [role]',
    description: 'Removes a role from a specified member. Be sure that the role exists so it can be ungranted!',

    run: async(bot, message, args) => {
        let role = message.guild.roles.cache.find(r => r.name.toLowerCase() === args[1]) || message.guild.roles.cache.find(r => r.id === args[1]) || message.mentions.roles.first();
        let toRemoveRole = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        let logChannel = message.guild.channels.cache.find(c => c.name.toLowerCase() === 'toucan-logs') || message.channel;


        // Putting the embed up here so it doesn't error bc of hoisting
        let rEmbed = new Discord.MessageEmbed()
            .setColor(role.id.hexColor || '#293749')
            .setDescription('**Removed Role from User**')
            .setTimestamp()
            .addField('Removed from', `${toRemoveRole} (${toRemoveRole.id})`)
            .addField('Removed by:', `${message.author} ${message.author.id}`); 
        

        // User can't remove roles
        if (!message.member.hasPermission('MANAGE_ROLES')) {
            message.channel.send('You don\'t have permissions to remove roles to other members')
                .then(m => m.delete({timeout: 5000}));
        }

        // Bot doesn't have permission to remove roles (it does by default)
        if (!message.guild.me.hasPermission('MANAGE_ROLES')) {
            message.channel.send('I don\'t have permissions to remove roles to a member, please enable the "Manage Roles" permission')
                .then(m => m.delete({timeout: 5000}));
        }

        // No such role found
        if (!role) {
            message.channel.send('Didn\'t quite find the role, are you sure you made it?')
                .then(m => m.delete({timeout: 5000}));
        }

        // User doesn't have the role
        if (!toRemoveRole.roles.cache.has(role.id)) {
            message.channel.send('I\'m not removing a role from someone that doesn\'t have it...')
                .then(m => m.delete({timeout: 5000}));

        } else {
            await toRemoveRole.roles.remove(role.id);
            message.channel.send(`Succesfully removed the role ${role} from ${toRemoveRole.displayName}!`);
            logChannel.send(rEmbed);
        }
    }
};