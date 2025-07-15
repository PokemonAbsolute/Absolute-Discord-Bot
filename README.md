<div align="center">
  <img src="https://github.com/Toxocious/Absolute/raw/master/absolute/rpg/images/Assets/banner.png" title="Pokemon Absolute Logo" alt="Pokemon Absolute Logo" />
  <h1 align="center">Pok&eacute;mon Absolute &mdash; Discord Bot</h1>

  **Pok&eacute;mon Absolute** is an online text-based Pok&eacute;mon RPG, comprised of numerous features adapted from the official Pok&eacute;mon games, as well as entirely new features that enhance the playing experience of Pok&eacute;mon.

  This repository contains the source code for the [Pok&eacute;mon Absolute](https://github.com/Toxocious/Absolute) Discord bot.

  <img alt="Github Issues" src="https://img.shields.io/github/issues/Toxocious/Absolute-Discord-Bot?style=for-the-badge&logo=appveyor" />
  <img alt="Github Forks" src="https://img.shields.io/github/forks/Toxocious/Absolute-Discord-Bot?style=for-the-badge&logo=appveyor" />
  <img alt="Github Stars" src="https://img.shields.io/github/stars/Toxocious/Absolute-Discord-Bot?style=for-the-badge&logo=appveyor" />
  <br />

  <img alt="GitHub contributors" src="https://img.shields.io/github/contributors/Toxocious/Absolute-Discord-Bot?style=for-the-badge">
  <a href="https://visitorbadge.io/status?path=https%3A%2F%2Fgithub.com%2FToxocious%2FAbsolute-Discord-Bot">
    <img src="https://api.visitorbadge.io/api/visitors?path=https%3A%2F%2Fgithub.com%2FToxocious%2FAbsolute&label=Views&countColor=%234a618f&labelStyle=upper" />
  </a>
  <br />

  <img alt="License" src="https://img.shields.io/github/license/Toxocious/Absolute-Discord-Bot?style=for-the-badge&logo=appveyor" />

  Come join our comfy community over on Discord!

  <a href="https://discord.gg/SHnvbsS" target="_blank">
    <img src="https://discord.com/api/guilds/269182206621122560/widget.png?style=banner2" alt="Discord Invite Banner" />
  </a>
</div>



## Table of Contents
- [Table of Contents](#table-of-contents)
- [About The Project](#about-the-project)
  - [Tech Stack](#tech-stack)
  - [Available Commands](#available-commands)
  - [Developer Commands](#developer-commands)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Development](#development)
- [Contributing](#contributing)
- [License](#license)



## About The Project
### Tech Stack
- Node.JS
- TypeScript
- MySQL

### Available Commands
- **/about**
  - Provides basic information about Absolute RPG
- **/connect <auth_code>**
  - Connects your Discord account to your Absolute RPG account
- **/lastseen <user>**
  - Provides when the specified user was last online on the RPG
- **/rarity <species> <forme OPTIONAL>**
  - Provides data on how many of a given species of Pok&eacute;mon are in game
- **/test**
  - Generic test command that doesn't do anything

### Developer Commands
- **/restart**
  - Restarts the Absolute Discord bot
- **/status**
  - Displays misc. info about the bot (uptime, version, etc.) and its host



## Getting Started
It's expected that this bot is ran through its parent repository [Pok&eacute;mon Absolute](https://github.com/Toxocious/Absolute) via Docker.

> [!WARNING]
> This bot will fail to run if it is not able to connect to its designated database.

### Prerequisites
This project is configured and engineered specifically for [Pok&eacute;mon Absolute](https://github.com/Toxocious/Absolute), and as such, will not work out-of-the-box for anything else.

Do check out [.env.local](.env.local) to see what environment variables you'll need to run this bot.

### Development
If you do choose to add a feature or fix a bug, do note that your pull request will not be accepted if your code does not satisfy our eslint configuration.



## Contributing
If you're interested in contributing to Absolute, please check out the main repository's [CONTRIBUTING.md]([.github/CONTRIBUTING.md](https://github.com/Toxocious/Absolute/blob/master/.github/CONTRIBUTING.md)) for more information.



## License
This project is licensed under MIT.

For more information about the license, check out the [LICENSE](LICENSE).
