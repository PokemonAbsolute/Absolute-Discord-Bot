<div align="center">
  <img src="https://github.com/Toxocious/Absolute/raw/master/app/images/Assets/banner.png" title="Pokemon Absolute Logo" alt="Pokemon Absolute Logo" />
  <h1 align="center">Pok&eacute;mon Absolute &mdash; Discord Bot</h1>

  **Pok&eacute;mon Absolute** is an online text-based Pok&eacute;mon RPG, comprised of numerous features adapted from the official Pok&eacute;mon games, as well as entirely new features that enhance the playing experience of Pok&eacute;mon.

  This repository contains the source code for the [Pok&eacute;mon Absolute](https://github.com/Toxocious/Absolute) Discord bot.

  <img src="https://img.shields.io/github/issues/Toxocious/Absolute-Discord-Bot?style=for-the-badge&logo=appveyor" />
  <img src="https://img.shields.io/github/forks/Toxocious/Absolute-Discord-Bot?style=for-the-badge&logo=appveyor" />
  <img src="https://img.shields.io/github/stars/Toxocious/Absolute-Discord-Bot?style=for-the-badge&logo=appveyor" />
  <br />
  <img src="https://img.shields.io/github/license/Toxocious/Absolute-Discord-Bot?style=for-the-badge&logo=appveyor" />
  <a href="https://visitorbadge.io/status?path=https%3A%2F%2Fgithub.com%2FToxocious%Absolute-Discord-Bot">
    <img src="https://api.visitorbadge.io/api/visitors?path=https%3A%2F%2Fgithub.com%2FToxocious%Absolute-Discord-Bot&countColor=%2337d67a" />
  </a>
  <br /><br />

  Check us out on Discord and consider starring the repository if you liked it!

  <a href="https://discord.gg/Km6btPhs" target="_blank">
    <img src="https://discord.com/api/guilds/1002005327555862620/widget.png?style=banner2" alt="Discord Banner" />
  </a>
</div>



## Table of Contents
- [Table of Contents](#table-of-contents)
- [About The Project](#about-the-project)
  - [Tech Stack](#tech-stack)
  - [Available Commands](#available-commands)
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
- **/commands**
  - Provides a list of available Discord commands
- **/lastseen <user>**
  - Provides when the specified user was last online on the RPG
- **/rarity <species> <forme OPTIONAL>**
  - Provides data on how many of a given species of Pok&eacute;mon are in game
- **/test**
  - Generic test command that doesn't do anything



## Getting Started
It's expected that this bot is ran through its parent repository [Pok&eacute;mon Absolute](https://github.com/Toxocious/Absolute) via Docker.

**This bot will fail to run if it is not able to connect to its designated database.**

### Prerequisites
This project is configured and engineered specifically for [Pok&eacute;mon Absolute](https://github.com/Toxocious/Absolute), and as such, will not work out-of-the-box for anything else.

Do check out [.env.local](.env.local) to see what environment variables you'll need to run this bot.

### Development
If you do choose to add a feature or fix a bug, do note that your pull request will not be accepted if your code does not satisfy our eslint configuration.



## Contributing
If you're interested in contributing to Absolute, please check out the main repository's [CONTRIBUTING.md]([docs/CONTRIBUTING.md](https://github.com/Toxocious/Absolute/blob/master/docs/CONTRIBUTING.md)) for more information.



## License
This project is licensed under MIT.

For more information about the license, check out the [LICENSE](LICENSE).
