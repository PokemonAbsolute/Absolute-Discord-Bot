import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';

import { CommandInterface } from '../types/command';

export const TEST: CommandInterface = {
  data: new SlashCommandBuilder()
    .setName('test')
    .setDescription('Generic test command. Does nothing.'),

  run: async (interaction) => {
    try {
      await interaction.deferReply();

      const COMMAND_EMBED = new MessageEmbed();
      COMMAND_EMBED.setTitle('Absolute Bot | Test Command');
      COMMAND_EMBED.setDescription(
        'Generic test command. Does nothing.'
      );

      await interaction.editReply({ embeds: [COMMAND_EMBED] });
      return;
    } catch (err) {
      console.warn('[ERROR | Command List]', err);
    }
  },
};
