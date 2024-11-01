import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from '@discordjs/builders';

import { CommandInteraction } from 'discord.js';

export interface CommandInterface {
    name: string;
    description: string;
    developerOnly: boolean;
    ownerOnly: boolean;

    data: Omit<SlashCommandBuilder, 'addSubcommandGroup' | 'addSubcommand'> | SlashCommandSubcommandBuilder;

    run: (interaction: CommandInteraction) => Promise<void>;
}
