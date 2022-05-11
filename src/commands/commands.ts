import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';

import { COMMAND_DICTIONARY } from '../commands';

import { CommandInterface } from '../types/command';

const COMMAND_LIST: CommandInterface = {
  name: 'commands',
  description: 'Provides a list of available bot commands.',

  data: new SlashCommandBuilder()
    .setName('commands')
    .setDescription('Provides a list of available bot commands.'),

  run: async (interaction): Promise<void> => {
    try {
      await interaction.deferReply();

      const COMMAND_EMBED: MessageEmbed = new MessageEmbed()
        .setTitle('Available Commands')
        .setDescription('Provides a list of available Absolute Bot commands.')
        .setColor('#4a618f')
        .setTimestamp();

      for (const COMMAND of COMMAND_DICTIONARY) {
        COMMAND_EMBED.addField(COMMAND.name, COMMAND.description);
      }

      await interaction.editReply({ embeds: [COMMAND_EMBED] });
    } catch (err) {
      console.warn('[ERROR | Command List]', err);
    }
  },
};

export default COMMAND_LIST;
