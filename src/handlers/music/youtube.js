const Discord = require('discord.js'),
    ytdl = require('discord-ytdl-core'),
    ytpl = require('ytpl'),
    ytsr = require('youtube-sr');

/**
 * 
 * @param {Discord.Client} bot The Client
 * @param {Discord.Message} message Message to get different djs stuff
 * @param {String} url The URL to retrieve info from
 * @param {Boolean} search Is search enabled?
 * @param {Boolean} playlist Is playlist retrieving enabled?
 */
module.exports = async (bot, message, url, search, playlist) => {
    // Video URL download
    if (!search && !playlist) {
        let info = await ytdl.getBasicInfo(url);

        let audio = ytdl.downloadFromInfo(info, {
            filter: 'audioonly',
            opusEncoded: true,
            encoderArgs: ['-af', 'bass=g=10, dynaudnorm=f=200']
        });
    
        return {
            name: info.videoDetails.title,
            author: info.videoDetails.author.name,
            link: info.videoDetails.video_url
        };
    // Playlist URL download
    } else if (!search && playlist) {

    // Search videos
    } else if (search && !playlist) {
        
    // No options
    } else {
        throw new Error('Nothing to do with the function');
    }
    
};