import { Interaction } from 'discord.js';
import { COMMAND_DICTIONARY } from '../commands';

export const ON_INTERACTION = async (
  interaction: Interaction
): Promise<void> => {
  try {
    if (interaction.isCommand()) {
      for (const COMMAND of COMMAND_DICTIONARY) {
        if (interaction.commandName === COMMAND.data.name) {
          await COMMAND.run(interaction);
          break;
        }
      }
    }
  } catch (err) {
    console.warn(
      '[Absolute / Discord Bot] Failed to run a command interaction:',
      err
    );
  }
};
