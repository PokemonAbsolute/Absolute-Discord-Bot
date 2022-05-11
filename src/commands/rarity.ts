import { getPokemonRarity } from '../util/get-pokemon-rarity';

import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';

import { CommandInterface } from '../types/command';

const RARITY: CommandInterface = {
  name: 'rarity',
  description: 'Fetches the rarity of a given Pokemon species.',

  data: new SlashCommandBuilder()
    .setName('rarity')
    .setDescription('Fetches the rarity of a given Pokemon species.')
    .addStringOption((option) =>
      option
        .setName('species')
        .setDescription('The primary Pok&eacute;mon species to find.')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('forme')
        .setDescription('The forme of the Pok&eacute;mon species.')
        .setRequired(false)
    ),

  run: async (interaction): Promise<void> => {
    try {
      await interaction.deferReply();

      const SPECIES = interaction.options.getString('species', true);
      const FORME = interaction.options.getString('forme', false);

      const RARITY_DATA = await getPokemonRarity(SPECIES, FORME);

      const COMMAND_EMBED = new MessageEmbed()
        .setTitle(`${SPECIES + (FORME ? `(${FORME})` : '')}'s Rarity`)
        .setColor('#4a618f')
        .setTimestamp();

      if (typeof RARITY_DATA === 'undefined') {
        COMMAND_EMBED.addField(
          'Error',
          'An error occurred while fetching the rarity of the specified Pokemon.'
        );
      } else {
        COMMAND_EMBED.addField(
          'Total',
          RARITY_DATA[0]?.TOTAL?.toLocaleString() ?? '0'
        );
        COMMAND_EMBED.addField(
          'Normal',
          RARITY_DATA[0]?.NORMAL?.toLocaleString() ?? '0',
          true
        );
        COMMAND_EMBED.addField(
          'Shiny',
          RARITY_DATA[0]?.SHINY?.toLocaleString() ?? '0',
          true
        );
      }

      await interaction.editReply({ embeds: [COMMAND_EMBED] });
    } catch (err) {
      console.warn('[Command | Test] An error occurred:', err);
    }
  },
};

export default RARITY;
