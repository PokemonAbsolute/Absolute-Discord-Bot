import { Client, Collection, Events, ActivityType, GatewayIntentBits } from 'discord.js';

import { config, validateEnvironment } from './util/validate-env';

import { CommandManager } from './classes/CommandManager';

import { LogHandler } from './handlers/log-handler';

import MySQL from './classes/mysql';

const MYSQL_INSTANCE: MySQL = MySQL.instance;

/**
 * We only want to start up the Discord bot IF we can make a successful database connection.
 * This is because much of the bot depends on being able to access the RPG's database for its commands.
 */
MYSQL_INSTANCE.connectDatabase()
    .catch((err) =>
        console.error("[Absolute / Discord Bot] Failed to connect to Absolute's database", err)
    )
    .finally(() => {
        (async () => {
            // Validate our environment variables.
            // Exits the process if any required values are not found/set.
            validateEnvironment();

            // Create the Bot client.
            const client = new Client({
                // @ts-expect-error - Can not properly type-set `intent`
                intents: Object.values(GatewayIntentBits).reduce((acc, intent) => acc | intent, 0),
            });

            const logHandler = new LogHandler(client);
            const commandManager = new CommandManager(client, logHandler);

            client.once(Events.ClientReady, async () => {
                logHandler.log(`Bot has been logged in as ${client.user?.displayName}!`);

                client?.user?.setPresence({
                    activities: [{ name: `Awaiting disaster.`, type: ActivityType.Custom }],
                    status: 'online',
                });

                commandManager.Initialize();
            });

            client.login(config.DISCORD_BOT_TOKEN).catch(console.error);
        })();
    });
