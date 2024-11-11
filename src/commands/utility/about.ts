import { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } from 'discord.js';

import { CommandInterface } from '../../types/command';

import { createEmbed, EmbedOptions } from '../../handlers/embed-builder';

import { config } from '../../util/validate-env';

const ABOUT: CommandInterface = {
    name: 'about',
    description: "Displays information about Absolute's Discord Bot.",

    category: 'utility',
    cooldown: 0,

    permissions: [],

    developerOnly: false,
    ownerOnly: false,

    data: new SlashCommandBuilder()
        .setName('about')
        .setDescription("Displays information about Absolute's Discord Bot."),

    execute: async (interaction) => {
        try {
            await interaction.deferReply();

            const aboutDescription = `
              The Pokémon Absolute is an up-to-date multiplayer Pokémon RPG, featuring all currently released canonical Pokémon from the main Pokémon games!\n
              Among featuring a plethora of unique gameplay content to explore, we offer content that will appeal to all trainers, new and old, including content that Pokémon veterans will find nostalgic.\n
              We're open-source on GitHub if you'd like to take a peek at the magic behind the curtain!
            `;

            const embedOptions: EmbedOptions = {
                titleText: 'About Absolute',
                description: aboutDescription,
                footerText: `Made with energy drinks by ${config.DEVELOPER_NAME}`,
                color: '#4A618F',
                timestamp: false,

                thumbnailURL:
                    'https://cdn.discordapp.com/avatars/269254827987435521/c9cdd467e47d0494a0ae8be61d40d582.webp?size=128',
            };

            const rpgButton = new ButtonBuilder()
                .setLabel('Absolute RPG')
                .setStyle(ButtonStyle.Link)
                .setURL(`https://absoluterpg.com`);

            const githubButton = new ButtonBuilder()
                .setLabel('Github')
                .setStyle(ButtonStyle.Link)
                .setURL(`https://github.com/toxocious`);

            const actionRow = new ActionRowBuilder().addComponents(githubButton, rpgButton);

            const embed = createEmbed(embedOptions);

            // @ts-expect-error - N/A
            await interaction.editReply({ embeds: [embed], components: [actionRow] });
        } catch (err) {
            console.warn('[Command | Test] An error occurred:', err);
        }
    },
};

export default ABOUT;
