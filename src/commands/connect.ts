import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';

import { getPlayerbyAuthCode } from '../util/get-player-by-auth-code';
import { connectDiscordAccount } from '../util/connect-discord-account';

import { CommandInterface } from '../types/command';

const CONNECT: CommandInterface = {
  name: 'connect',
  description:
    'Connects your Discord account to your Pokemon Absolute RPG account.',

  data: new SlashCommandBuilder()
    .setName('connect')
    .setDescription(
      'Connects your Discord account to your Pok&eacute;mon Absolute RPG account.'
    )
    .addStringOption((option) =>
      option
        .setName('auth_code')
        .setDescription("Authentication code of the player's account.")
        .setRequired(true)
    ),

  run: async (interaction): Promise<void> => {
    try {
      await interaction.deferReply();

      const AUTH_CODE = interaction.options.getString('auth_code', true);

      const PLAYER_DATA = await getPlayerbyAuthCode(AUTH_CODE);

      let COMMAND_EMBED: MessageEmbed;

      if (typeof PLAYER_DATA === 'undefined') {
        COMMAND_EMBED = new MessageEmbed()
          .setTitle('Command Error')
          .addField(
            'Description',
            `Unable to find the user corresponding to the entered auth code.`
          )
          .setColor('#FF0000')
          .setTimestamp();
      } else {
        const CONNECTION_RESPONSE = await connectDiscordAccount(
          interaction.user.id,
          interaction.user.tag,
          AUTH_CODE
        );

        COMMAND_EMBED = new MessageEmbed()
          .setTitle('Account Connected')
          .setDescription(
            `Your account is connected to the RPG account ${CONNECTION_RESPONSE.Username}.`
          )
          .setColor('#4a618f')
          .setTimestamp();
      }

      await interaction.editReply({ embeds: [COMMAND_EMBED] });
    } catch (err) {
      console.warn('[Command | Connect] An error occurred:', err);
    }
  },
};

export default CONNECT;
