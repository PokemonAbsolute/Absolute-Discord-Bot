import {
    CommandInteraction,
    CacheType,
    Events,
    ActivityType,
    SlashCommandBuilder,
} from 'discord.js';

import { CommandInterface } from '../../types/command';

import { createEmbed, EmbedOptions } from '../../handlers/embed-builder';
import { LogHandler } from '../../handlers/log-handler';

import { config } from '../../util/validate-env';
import { CommandManager } from '../../classes/CommandManager';

const RESTART: CommandInterface = {
    name: 'restart',
    description: "Restarts Absolute's Discord Bot.",

    category: 'dev',
    cooldown: 0,

    permissions: [],

    developerOnly: true,
    ownerOnly: false,

    data: new SlashCommandBuilder()
        .setName('restart')
        .setDescription("Restarts Absolute's Discord Bot."),

    execute: async (interaction: CommandInteraction<CacheType>): Promise<void> => {
        const client = interaction.client;

        await interaction.deferReply();

        try {
            const embedOptions: EmbedOptions = {
                titleText: 'Restarting',
                description: `Absolute Bot is now restarting. Please wait.`,
                footerText: ``,
                color: '#4A618F',
                timestamp: true,
            };

            const embed = createEmbed(embedOptions);

            await interaction.editReply({
                embeds: [embed],
            });

            await client.destroy();
            await client.login(config.DISCORD_BOT_TOKEN);

            client.once(Events.ClientReady, async () => {
                client?.user?.setPresence({
                    activities: [{ name: `Awaiting disaster.`, type: ActivityType.Custom }],
                    status: 'online',
                });

                // Initlaize handlers.
                const logHandler = new LogHandler(client);
                const commandManager = new CommandManager(client, logHandler).Initialize();
            });

            const embedOptions2: EmbedOptions = {
                titleText: 'Restarted',
                description: `Absolute Bot has successfully restarted.`,
                footerText: ``,
                color: '#4A618F',
                timestamp: true,
            };

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
