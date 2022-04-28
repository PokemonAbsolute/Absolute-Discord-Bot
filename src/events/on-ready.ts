import { REST } from '@discordjs/rest';
import { Client } from 'discord.js';
import { Routes } from 'discord-api-types/v9';
import { COMMAND_DICTIONARY } from '../commands';

export const ON_READY = async (BOT: Client): Promise<void> => {
  try {
    const rest = new REST({ version: '9' }).setToken(
      process.env.DISCORD_BOT_TOKEN as string
    );

    const COMMAND_DATA: {
      name: string;
      description?: string;
      type?: number;
      options?: any;
    }[] = [];

    COMMAND_DICTIONARY.forEach((command) => {
      COMMAND_DATA.push(
        command.data.toJSON() as {
          name: string;
          description?: string;
          type?: number;
          options?: any;
        }
      );
    });

    await rest.put(
      Routes.applicationGuildCommands(
        BOT.user?.id || 'Missing Bot Token',
        process.env.GUILD_ID as string
      ),
      { body: COMMAND_DATA }
    );

    console.log('[Event | On Ready] Absolute Discord Bot has connected.');
  } catch (err) {
    console.warn('[Event | On Ready]', err);
  }
};
