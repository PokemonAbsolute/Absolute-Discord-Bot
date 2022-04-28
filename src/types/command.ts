import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

export interface CommandInterface {
  data: SlashCommandBuilder | SlashCommandSubcommandBuilder;
  run: (interaction: CommandInteraction) => Promise<void>;
}
