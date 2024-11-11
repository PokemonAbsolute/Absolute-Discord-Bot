import {
    CommandInteraction,
    PermissionFlagsBits,
    SlashCommandBuilder,
    SlashCommandSubcommandsOnlyBuilder,
    SlashCommandOptionsOnlyBuilder,
} from 'discord.js';

export interface CommandInterface {
    name: string;
    description: string;
    developerOnly: boolean;
    ownerOnly: boolean;

    category: string;
    cooldown: number | undefined;

    permissions?: (typeof PermissionFlagsBits)[];

    data:
        | SlashCommandBuilder
        | SlashCommandSubcommandsOnlyBuilder
        | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>
        | SlashCommandOptionsOnlyBuilder;

    execute: (interaction: CommandInteraction) => Promise<void>;
}
