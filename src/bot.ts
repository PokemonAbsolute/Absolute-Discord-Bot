import { Client, Collection, Events, ActivityType, GatewayIntentBits } from 'discord.js';

// import MySQL from './classes/mysql';

import { config, validateEnvironment } from './util/validate-env';

import { LoadCommands, SyncCommands } from './handlers/command-handler';
import { LogHandler } from './handlers/log-handler';

// const MYSQL_INSTANCE: MySQL = MySQL.instance;

// MYSQL_INSTANCE.connectDatabase()
//     .catch((err) => console.error("[Absolute / Discord Bot] Failed to connect to Absolute's database", err))
//     .finally(() => {
//         (async () => {
//             if (!validateEnvironment()) {
//                 return;
//             }

//             const client = new Client({
//                 // intents: INTENT_OPTIONS,
//                 intents: Object.values(GatewayIntentBits).reduce((acc, intent: any) => acc | intent, 0),
//             });

//             client.once(Events.ClientReady, async () => await ON_READY());

//             client.on('interactionCreate', async (interaction) => await ON_INTERACTION(interaction));

//             await client.login(process.env.DISCORD_BOT_TOKEN as string);
//         })();
//     });

// client.once(Events.ClientReady, async () => await ON_READY());

// client.on('interactionCreate', async (interaction) => await ON_INTERACTION(interaction));

// client.login(process.env.DISCORD_BOT_TOKEN as string);

// ============================
// ============================
// ============================

// Validate our environment variables.
// Exits the process if any required values are not found/set.
validateEnvironment();

// Create the Bot client.
const client = new Client({
    // @ts-expect-error - Can not properly type-set `intent`
    intents: Object.values(GatewayIntentBits).reduce((acc, intent) => acc | intent, 0),
});

// @ts-ignore
client.commands = new Collection();
// @ts-ignore
client.cooldowns = new Collection();

const logHandler = new LogHandler(client);

client.once(Events.ClientReady, async () => {
    client?.user?.setPresence({
        activities: [{ name: `Awaiting disaster.`, type: ActivityType.Custom }],
        status: 'online',
    });

    // initlaize handlers
    await LoadCommands(client, logHandler).catch(logHandler.error);
    // await eventHandler.loadEvents(client).catch(console.error);
    // await componentHandler.loadComponents(client).catch(console.error);
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isCommand()) {
        return;
    }

    await SyncCommands(client, interaction).catch(logHandler.error);
});

client.login(config.DISCORD_BOT_TOKEN).catch(console.error);
