import { AutocompleteInteraction, CacheType, EmbedBuilder, SlashCommandBuilder } from 'discord.js';

import { CommandInterface, CommandOptionData } from '../../types/command';

import { getPokemonRarity } from '../../util/get-pokemon-rarity';

import PokedexData from '../../data/pokedex.json';

const RARITY: CommandInterface = {
    name: 'rarity',
    description: 'Fetches the rarity of a given Pokemon species.',

    category: 'rpg',
    cooldown: 0,

    permissions: [],

    developerOnly: false,
    ownerOnly: false,

    data: new SlashCommandBuilder()
        .setName('rarity')
        .setDescription('Fetches the rarity of a given Pokemon species.')
        .addStringOption((option) =>
            option
                .setName('species')
                .setDescription('The primary Pokemon species to find.')
                .setRequired(true)
                .setAutocomplete(true)
        ),

    autocomplete: async (interaction: AutocompleteInteraction<CacheType>): Promise<void> => {
        const focusedValue = interaction.options.getFocused();

        if (focusedValue.trim() === '') {
            return await interaction.respond(
                PokedexData.slice(0, 10).map((DexEntry) => ({
                    name: DexEntry.Fullname ?? DexEntry.Name,
                    value: `${DexEntry.Pokedex_ID}.${DexEntry.Alt_ID}`.toString(),
                }))
            );
        }

        const filteredEntries = PokedexData.filter((DexEntry) =>
            (DexEntry?.Fullname ?? DexEntry.Name)
                .toLowerCase()
                .startsWith(focusedValue.toLowerCase())
        );

        const maxResults = 25;
        const results = filteredEntries.slice(0, maxResults).map((DexEntry) => ({
            name: DexEntry.Fullname ?? DexEntry.Name,
            value: `${DexEntry.Pokedex_ID}.${DexEntry.Alt_ID}`.toString(),
        }));

        await interaction.respond(results);
    },

    execute: async (interaction): Promise<void> => {
        try {
            await interaction.deferReply();

            const PokemonSpecies = interaction.options.get(
                'species',
                true
            ) as unknown as CommandOptionData;

            const [ID, Alt_ID] = PokemonSpecies.value.split('.');

            const RarityData = await getPokemonRarity(ID, Alt_ID);

            // Invalid Pokemon was selected.
            if (typeof RarityData === 'undefined') {
                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`Rarity Checked`)
                            .setDescription(
                                'An error occurred while fetching the rarity of the specified Pokemon.'
                            )
                            .setColor('#4a618f')
                            .setTimestamp(),
                    ],
                });

                return;
            }

            const PokemonFullName = RarityData[0].Forme
                ? `${RarityData[0].Pokemon} ${RarityData[0].Forme}`
                : RarityData[0].Pokemon;

            const RarityEmbed = new EmbedBuilder()
                .setTitle(`${PokemonFullName}'s Rarity`)
                .setColor('#4a618f')
                .setTimestamp()
                .addFields(
                    { name: 'Total', value: RarityData[0]?.TOTAL?.toLocaleString() ?? '0' },
                    { name: 'Normal', value: RarityData[0]?.NORMAL?.toLocaleString() ?? '0' },
                    { name: 'Shiny', value: RarityData[0]?.SHINY?.toLocaleString() ?? '0' }
                );

            await interaction.editReply({ embeds: [RarityEmbed] });
        } catch (err) {
            console.warn('[Command | Test] An error occurred:', err);
        }
    },
};

export default RARITY;
