# jaidens-discord-utilities

Welcome! This is the repository where all the code for the r/JA Discord Bot (also known as Ari Bot) is stored.
### [Join the server](https://discord.gg/gArXkYz)

## Description
Ari Bot is focused on providing the r/JA server and its members an efficient and useful variety of features. Its main focus has been the utility (for so the repository name), coping with Tofu Bot from [MaxTechnics](https://github.com/MaxTechnics)

Some of the main features Ari Bot includes are:
* Information/Util commands (user-info, server-info, avatar)
* Moderation commands
* Highly customizable settings and word blacklisting
* Low-latency work and low outage (since it doesn't have to be sharded like most mainstream bots)
* Other miscellaneous and fun features (urban, math, special welcome messages, etc.)

# Acknowledgements
* MaxTechnics
* RetainedEdge
* Acama
* KiritoTheOneShotter
* the DJS community
* and everyone who has helped me in any way on this project
###### but specially me lmaooo


# Installation
**NOTE:** This bot is not intended for personal use, the bot is made to meet the r/JA Discord Server necessities, and it might malfunction if used as-is.

1. Make a bot application and retrieve the token, [here's how](https://discordjs.guide/preparations/setting-up-a-bot-application.html)
1. Clone this repo
1. Run `npm init -y`
1. Run `npm i`
1. You have to add/modify certain core files, here's the list:

**.env**
```
DISCORD_TOKEN=[your token]
```

**config.json**
```json
{
    "prefix": "prefix",
    "owner": "owner tag",
    "ownerID": "owner id",
    "jaidenServerID": "main server's id",
    "mainChannel": "#general's id",
    "logChannel": "logs channel"
}
```

**botSettings.json**
```json
{
    "welcomer": true,
    "blacklisting": true,
    "blacklistLogs": true,
    "disabledCommands": []
}
```

**src/handlers/blacklisted-words.json**
```json
{
  "jr34": [],
  "nsfw": [],
  "offensive": []
}
```

6. Run `node index`
7. Enjoy I guess lol

- - -
Made with love by Tera (´• ω •`)
##### MIT License, do what you want.