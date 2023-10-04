import 'dotenv/config';

import { Routes } from 'discord-api-types/v9';
import { REST } from '@discordjs/rest';

import { COMMAND_DICTIONARY } from '../commands';
import { CommandInterface } from '../types/command';

export const ON_READY = async (): Promise<void> => {
  try {
    const COMMAND_DATA: CommandInterface[] = [];

    COMMAND_DICTIONARY.forEach((command) => {
      COMMAND_DATA.push(command.data.toJSON() as CommandInterface);
    });

    const rest = new REST({ version: '9' }).setToken(
      process.env.DISCORD_BOT_TOKEN as string
    );

    (async () => {
      try {
        await rest.put(
          Routes.applicationGuildCommands(
            process.env.CLIENT_ID as string,
            process.env.GUILD_ID as string
          ),
          { body: COMMAND_DATA }
        );
      } catch (error) {
        console.error(error);
      }
    })();

    console.log('[Absolute / Discord Bot] Connected successfully.');
  } catch (err) {
    console.warn('[Absolute / Discord Bot] Was not able to connect.', err);
  }
};
