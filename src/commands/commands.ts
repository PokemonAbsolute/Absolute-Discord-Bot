import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';

import { CommandInterface } from '../types/command';

export const COMMAND_LIST: CommandInterface = {
  data: new SlashCommandBuilder()
    .setName('commands')
    .setDescription('Provides a list of available bot commands.'),

  run: async (interaction) => {
    try {
      await interaction.deferReply();

      const COMMAND_EMBED = new MessageEmbed();
      COMMAND_EMBED.setTitle('Absolute Bot | Available Commands');
      COMMAND_EMBED.setDescription(
        'Provides a list of available Absolute Bot commands.'
      );
      COMMAND_EMBED.addField(
        'commands',
        'Provides a list of available Absolute Bot commands.'
      );
      COMMAND_EMBED.addField('test', 'Generic test command. Does nothing.');

      await interaction.editReply({ embeds: [COMMAND_EMBED] });
      return;
    } catch (err) {
      console.warn('[ERROR | Command List]', err);
    }
  },
};
