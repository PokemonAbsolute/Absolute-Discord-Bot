import 'dotenv/config';

import { Client, Events } from 'discord.js';

import MySQL from './classes/mysql';

import { INTENT_OPTIONS } from './config/client-intents';

import { ON_READY } from './events/on-ready';
import { ON_INTERACTION } from './events/on-interaction';

import { VALIDATE_ENV } from './util/validate-env';

const MYSQL_INSTANCE: MySQL = MySQL.instance;

MYSQL_INSTANCE.connectDatabase()
  .catch((err) =>
    console.error(
      "[Absolute / Discord Bot] Failed to connect to Absolute's database",
      err
    )
  )
  .finally(() => {
    (async () => {
      if (!VALIDATE_ENV()) {
        return;
      }

      const client = new Client({
        intents: INTENT_OPTIONS,
      });

      client.once(Events.ClientReady, async () => await ON_READY());

      client.on(
        'interactionCreate',
        async (interaction) => await ON_INTERACTION(interaction)
      );

      await client.login(process.env.DISCORD_BOT_TOKEN as string);
    })();
  });
