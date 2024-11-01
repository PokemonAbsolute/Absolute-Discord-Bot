import path from 'path';

import { config } from '../util/validate-env';

import { REST, Routes, Collection, Client, Interaction } from 'discord.js';

import { readFilesRecursively } from '../util/read-files';

import { LogHandler } from './log-handler';

const UnloadCommands = async (
    rest: REST,
    client: Client,
    logHandler: LogHandler
): Promise<void> => {
    return;

    console.log('Started clearing commands.');

    const guildsPopulated = ['269182206621122560', '1002005327555862620'];

    for (const guild of guildsPopulated) {
        await rest.put(Routes.applicationGuildCommands(config.DISCORD_BOT_CLIENT_ID, guild), {
            body: [],
        });

        await rest.put(Routes.applicationCommands(config.DISCORD_BOT_CLIENT_ID), {
            body: [],
        });
    }

    console.log('Successfully cleared commands.');
};

export const LoadCommands = async (client: Client, logHandler: LogHandler): Promise<void> => {
    const commandDirectory = path.join(__dirname, '../commands');

    const commandFiles = await readFilesRecursively(commandDirectory);
    logHandler.log(`Loading ${commandFiles.length} commands.`);
    if (commandFiles.length === 0) {
        logHandler.warn('There are no command files to be read.');
        return;
    }

    if (config.BOT_DEPLOY_COMMANDS) {
        for (const command of commandFiles) {
            if (typeof command == 'undefined') {
                continue;
            }

            if ('data' in command && 'run' in command) {
                // @ts-ignore
                client.commands.set(command.data.name, command);

                console.log(command);
            }
        }

        const rest = new REST().setToken(config.DISCORD_BOT_TOKEN);

        await UnloadCommands(rest, client, logHandler);

        // re-register commands
        try {
            const now = Date.now();

            logHandler.log('Started refreshing application commands.');

            // @ts-ignore
            await rest.put(
                Routes.applicationGuildCommands(client.user.id, config.DISCORD_GUILD_ID),
                {
                    body: commandFiles,
                }
            );

            logHandler.log(`Successfully reloaded application commands (${Date.now() - now}ms)`);
        } catch (error) {
            logHandler.error('Error registering commands:', error);
        }
    }
};

export const SyncCommands = async (client: Client, interaction: Interaction) => {
    if (!client || !interaction.isCommand()) {
        return;
    }

    // @ts-ignore
    const command = client.commands.get(interaction.commandName);
    if (!command) {
        return interaction.reply({
            content: 'Invalid command.',
            ephemeral: true,
        });
    }

    if (!interaction.inGuild()) {
        return interaction.reply({
            content: 'Invalid guild.',
            ephemeral: true,
        });
    }

    const userID = interaction.user.id;

    const defaultCooldown = 3;

    // TODO: Implement reduced cooldown for server owner, devs, and mods.
    const globalCooldownDelay = (command.globalCooldown ?? defaultCooldown) * 1_000;

    // Server owner commands.
    if (command.ownerOnly && interaction.user.id !== interaction.guild?.ownerId) {
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

    //  - Discord mod-only commands?
    // const member = interaction.member as GuildMember;
    //    Check for 'moderator' based role
    // const isModerator = member.roles.cache.some((role) => role.name === 'Moderator'); // Change 'Moderator' to your actual role name
    //    Alternatively, check for specific permissions
    // const hasPermission = member.permissions.has('MANAGE_ROLES'); // Example permission
    //
    // if (command.modOnly && (!userIsMod || !config.DEVELOPER_ID?.includes(userID))) {
    //     return interaction.reply({
    //         content: 'This command can only be executed by a developer or a discord server moderator.',
    //         ephemeral: true,
    //     });
    // }

    const now = Date.now();

    // @ts-ignore
    const globalCooldowns = client.globalCooldowns || new Collection();
    // @ts-ignore
    client.globalCooldowns = globalCooldowns;

    // @ts-ignore
    if (globalCooldowns.has(userID)) {
        // @ts-ignore
        const expirationTime = globalCooldowns.get(userID) + globalCooldownDelay;

        if (now < expirationTime) {
            const remainingTime = Math.ceil((expirationTime - now) / 1_000);

            return interaction.reply({
                content:
                    'Slow down! You must wait ${remainingTime} seconds before you can send the command again.'.replace(
                        '${remainingTime}',
                        remainingTime.toString()
                    ),
                ephemeral: true,
            });
        }
    }

    // @ts-ignore
    // update global cooldowns
    globalCooldowns.set(userID, now);

    // @ts-ignore
    setTimeout(() => globalCooldowns.delete(userID), globalCooldownDelay);

    try {
        await command.run(interaction);
    } catch (error) {
        console.error('Error executing command:', error);
    }
};
