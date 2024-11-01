import { Client, Collection, Events, ActivityType, GatewayIntentBits } from 'discord.js';

import { config, validateEnvironment } from './util/validate-env';

import { LoadCommands, SyncCommands } from './handlers/command-handler';
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

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore - Doesn't exist on the 'client' type.
            client.commands = new Collection();

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore - Doesn't exist on the 'client' type.
            client.cooldowns = new Collection();

            const logHandler = new LogHandler(client);

            client.once(Events.ClientReady, async () => {
                client?.user?.setPresence({
                    activities: [{ name: `Awaiting disaster.`, type: ActivityType.Custom }],
                    status: 'online',
                });

                // Initlaize handlers.
                await LoadCommands(client, logHandler).catch(logHandler.error);
            });

            client.on(Events.InteractionCreate, async (interaction) => {
                if (!interaction.isCommand()) {
                    return;
                }

                await SyncCommands(client, interaction).catch(logHandler.error);
            });

            client.login(config.DISCORD_BOT_TOKEN).catch(console.error);
        })();
    });
