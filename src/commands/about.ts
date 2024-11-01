import { SlashCommandBuilder } from '@discordjs/builders';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

import { CommandInterface } from '../types/command';

import { createEmbed, EmbedOptions } from '../handlers/embed-builder';

import { config } from '../util/validate-env';

const ABOUT: CommandInterface = {
    name: 'about',
    description: "Displays information about Absolute's Discord Bot.",
    developerOnly: false,
    ownerOnly: false,

    data: new SlashCommandBuilder()
        .setName('about')
        .setDescription("Displays information about Absolute's Discord Bot."),

    run: async (interaction) => {
        try {
            await interaction.deferReply();

            const embedOptions: EmbedOptions = {
                titleText: 'About Absolute',
                description: `Absolute is a web-based Pokemon RPG.`,
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
