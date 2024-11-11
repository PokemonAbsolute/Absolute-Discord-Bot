import {
    CommandInteraction,
    PermissionFlagsBits,
    SlashCommandBuilder,
    SlashCommandSubcommandsOnlyBuilder,
    SlashCommandOptionsOnlyBuilder,
    AutocompleteInteraction,
    CacheType,
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

    autocomplete?: (interaction: AutocompleteInteraction<CacheType>) => Promise<void>;
    execute: (interaction: CommandInteraction) => Promise<void>;
}

export interface CommandOptionData {
    name: string;
    type: number;
    value: string;
}
