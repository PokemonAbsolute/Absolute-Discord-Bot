import fs from 'fs';
import path from 'path';

import { config } from '../util/validate-env';

import { REST, Routes, Collection, Client, Interaction, Events } from 'discord.js';

import { LogHandler } from '../handlers/log-handler';

import { CommandInterface } from '../types/command';

/**
 * The CommandManager class handles the loading, unloading, and execution of commands.
 */
export class CommandManager {
    private client: Client;
    private logHandler: LogHandler;

    private commandData: Array<any> = [];
    private commands: Collection<string, CommandInterface> = new Collection();
    private cooldowns: Collection<string, any> = new Collection();
    private categories: Collection<string, any> = new Collection();

    // Constructor
    //  - Takes in a Discord bot client and a LogHandler instance.
    constructor(client: Client, logHandler: LogHandler) {
        this.client = client;
        this.logHandler = logHandler;
    }

    // Get all commands in a category
    public getCommandsByCategory(category: string): Collection<string, any> {
        return this.categories.get(category);
    }

    // Get all categories
    public getCategories(): string[] {
        return Array.from(this.categories.keys());
    }

    // Register all commands to the guild via the Discord API.
    private async RegisterCommands(): Promise<void> {
        if (typeof this.client.user?.id === 'undefined') {
            this.logHandler.error(
                'Unabled to register commands. The Discord bot client ID is undefined.'
            );
            return;
        }

        const rest = new REST().setToken(config.DISCORD_BOT_TOKEN);

        try {
            this.logHandler.log(
                `Started refreshing ${this.commands.size} application (/) commands.`
            );

            await rest.put(
                Routes.applicationGuildCommands(this.client.user.id, config.DISCORD_GUILD_ID),
                {
                    body: this.commandData,
                }
            );

            this.logHandler.log(
                `Successfully registered ${this.commands.size} application (/) commands.`
            );
        } catch (error) {
            this.logHandler.error('Error registering commands:', error);
        }
    }

    // Handles loading commands from the /commands directory and all subdirectories.
    private async LoadCommands(): Promise<void> {
        const commandsPath = path.join(__dirname, '../commands');
        const commandCategories = fs.readdirSync(commandsPath);

        for (const category of commandCategories) {
            const categoryPath = path.join(commandsPath, category);

            if (!fs.statSync(categoryPath).isDirectory()) {
                continue;
            }

            this.categories.set(category, new Collection());

            const commandFiles = fs
                .readdirSync(categoryPath)
                .filter((file) => file.endsWith('.ts') || file.endsWith('.js'));

            this.logHandler.log(
                `Loading _${commandFiles.length}_ commands from category: ${category}`
            );

            for (const file of commandFiles) {
                const commandPath = path.join(categoryPath, file);
                const command: CommandInterface = require(commandPath).default;

                console.log(command, '\n\n');
                if ('data' in command && 'execute' in command) {
                    command.category = category;
                    command.cooldown = command.cooldown ?? 3;

                    this.commandData.push(command.data.toJSON());
                    this.commands.set(command.data.name, command);
                    this.categories.get(category).set(command.data.name, command);

                    this.logHandler.log(`Loaded command: ${command.data.name}`);
                } else {
                    this.logHandler.warn(`Failed to load command: ${commandPath}`);
                    this.logHandler.warn(command);
                }
            }
        }
    }

    /**
     * Handles the cooldown of a command.
     */
    private async HandleCooldown(
        interaction: Interaction,
        command: CommandInterface,
        cooldownModifier: number
    ): Promise<void> {
        if (!this.cooldowns.has(command.data.name)) {
            this.cooldowns.set(command.data.name, new Collection());
        }

        const now = Date.now();
        const timestamps = this.cooldowns.get(command.data.name);
        const cooldownAmount = (command.cooldown ?? 3) * cooldownModifier;

        if (timestamps.has(interaction.user.id)) {
            const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                this.logHandler.warn(
                    `User ${interaction.user.id} is on cooldown for command ${
                        command.data.name
                    }. Time left: ${timeLeft.toFixed(1)}s`
                );
                return;
            }
        }

        timestamps.set(interaction.user.id, now);
        setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
    }

    /**
     * Initializes the command manager.
     */
    public async Initialize(): Promise<void> {
        // Load commands.
        await this.LoadCommands();

        // Register loaded commands.
        await this.RegisterCommands();

        // Handle command interactions.
        this.client.on(Events.InteractionCreate, async (interaction) => {
            if (!interaction.isChatInputCommand()) {
                return;
            }

            const command = this.commands.get(interaction.commandName);

            if (!command) {
                this.logHandler.warn(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                const userID = interaction.user.id;

                const devOwnerCooldownModifier =
                    userID === interaction.guild?.ownerId || config.DEVELOPER_ID?.includes(userID)
                        ? 0
                        : 1_000;

                await this.HandleCooldown(interaction, command, devOwnerCooldownModifier);

                // Owner only commands.
                if (command.ownerOnly && userID !== interaction.guild?.ownerId) {
                    return interaction.reply({
                        content: 'This command can only be executed by the server owner.',
                        ephemeral: true,
                    });
                }

                // Developer only commands.
                if (command.developerOnly && !config.DEVELOPER_ID?.includes(userID)) {
                    return interaction.reply({
                        content: 'This command can only be executed by a developer.',
                        ephemeral: true,
                    });
                }

                // Check if the command requires any permissions, and if the user has them.
                if (command.permissions) {
                    const member = interaction.member;

                    // @ts-expect-error - .has() does not exist on type 'string | Readonly<PermissionsBitField>'
                    if (!member?.permissions.has(command.permissions)) {
                        return interaction.reply({
                            content: 'You lack the required permissions to use this command.',
                            ephemeral: true,
                        });
                    }
                }

                // Execute the command.
                await command.execute(interaction);
            } catch (error) {
                this.logHandler.error(`Error running command ${command.data.name}:`, error);
            }
        });
    }
}
