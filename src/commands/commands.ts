import { SlashCommandBuilder } from '@discordjs/builders';
import { EmbedBuilder } from 'discord.js';

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

      const embed_fields: Array<{ name: string; value: string }> = [];
      for (const COMMAND of COMMAND_DICTIONARY) {
        embed_fields.push({ name: COMMAND.name, value: COMMAND.description });
      }

      const COMMAND_EMBED: EmbedBuilder = new EmbedBuilder()
        .setTitle('Available Commands')
        .setDescription('Provides a list of available Absolute Bot commands.')
        .setColor('#4a618f')
        .setTimestamp()
        .addFields(embed_fields);

      await interaction.editReply({ embeds: [COMMAND_EMBED] });
    } catch (err) {
      console.warn('[ERROR | Command List]', err);
    }
  },
};

export default COMMAND_LIST;
