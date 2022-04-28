import 'dotenv/config';

import { VALIDATE_ENV } from './util/validate-env';

import { Client } from 'discord.js';

import { INTENT_OPTIONS } from './config/client-intents';

import { ON_READY } from './events/on-ready';
import { ON_INTERACTION } from './events/on-interaction';

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
