import 'dotenv/config';

import { Client } from 'discord.js';

import MySQL from './classes/mysql';

import { INTENT_OPTIONS } from './config/client-intents';

import { ON_READY } from './events/on-ready';
import { ON_INTERACTION } from './events/on-interaction';

import { VALIDATE_ENV } from './util/validate-env';

const MYSQL_INSTANCE: MySQL = MySQL.instance;

MYSQL_INSTANCE.connectDatabase().finally(() => {
  (async () => {
    if (!VALIDATE_ENV()) {
      return;
    }

    const BOT = new Client({
      intents: INTENT_OPTIONS,
    });

    BOT.once('ready', async () => await ON_READY(BOT));

    BOT.on(
      'interactionCreate',
      async (interaction) => await ON_INTERACTION(interaction)
    );

    await BOT.login(process.env.DISCORD_BOT_TOKEN as string);
  })();
});
