import { CommandInteraction, CacheType } from 'discord.js';

import { SlashCommandBuilder } from '@discordjs/builders';

import { CommandInterface } from '../types/command';

import { createEmbed, EmbedOptions } from '../handlers/embed-builder';

import { config } from '../util/validate-env';

const RESTART: CommandInterface = {
    name: 'restart',
    description: "Restarts Absolute's Discord Bot.",
    developerOnly: true,
    ownerOnly: false,

    data: new SlashCommandBuilder().setName('restart').setDescription("Restarts Absolute's Discord Bot."),

    run: async (interaction: CommandInteraction<CacheType>): Promise<void> => {
        const client = interaction.client;

        await interaction.deferReply();

        try {
            const embedOptions: EmbedOptions = {
                fields: [
                    {
                        name: 'Restart',
                        value: `Bot is restarting...`,
                        inline: true,
                    },
                ],

                titleText: '**Restart**',
                description: RESTART.description,
                footerText: ``,
                color: '#4A618F',
                timestamp: true,
            };

            // create embed
            const embed = createEmbed(embedOptions);

            await interaction.editReply({
                embeds: [embed],
            });

            await client.destroy();
            await client.login(config.DISCORD_BOT_TOKEN);

            const embedOptions2: EmbedOptions = {
                fields: [
                    {
                        name: 'Restart',
                        value: `Absolute Bot has successfully restarted.`,
                        inline: true,
                    },
                ],

                titleText: '**Restarting**',
                description: RESTART.description,
                footerText: ``,
                color: '#4A618F',
                timestamp: true,
            };

            // create embed
            const embed2 = createEmbed(embedOptions2);

            await interaction.followUp({
                embeds: [embed2],
            });
        } catch (error) {
            console.error('Error executing command:', error);

            await interaction.editReply({
                content: 'An error occurred while executing the command.',
            });
        }
    },
};

export default RESTART;
