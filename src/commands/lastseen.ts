import { lastSeenOn } from '../util/last-seen';

import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';

import { CommandInterface } from '../types/command';
import MySQL from '../classes/mysql';

const LAST_SEEN: CommandInterface = {
  name: 'lastseen',
  description: 'Fetches the time that the specified user was last seen on.',

  data: new SlashCommandBuilder()
    .setName('lastseen')
    .setDescription(
      'Fetches the time that the specified user was last seen on.'
    )
    .addStringOption((option) =>
      option
        .setName('user')
        .setDescription('Username or ID of the player.')
        .setRequired(true)
    ),

  run: async (interaction): Promise<void> => {
    try {
      await interaction.deferReply();

      const USER_OPTION = interaction.options.getString('user', true);

      const USER_DATA_QUERY: any = await MySQL.doQuery(
        'SELECT `Username`, `Last_Active` FROM `users` WHERE UPPER(`Username`) = UPPER(?) OR `ID` = ? LIMIT 1',
        [USER_OPTION, USER_OPTION]
      );
      const USER_DATA = USER_DATA_QUERY[0];

      let COMMAND_EMBED: MessageEmbed;

      if (typeof USER_DATA === 'undefined') {
        COMMAND_EMBED = new MessageEmbed()
          .setTitle('Command Error')
          .addField(
            'Description',
            `Unable to find user data for ${USER_OPTION}.`
          )
          .setColor('#FF0000')
          .setTimestamp();
      } else {
        COMMAND_EMBED = new MessageEmbed()
          .setTitle('Last Seen')
          .addField('User', USER_DATA?.Username, true)
          .addField('Last Seen', lastSeenOn(USER_DATA?.Last_Active), true)
          .setColor('#4a618f')
          .setTimestamp();
      }

      await interaction.editReply({ embeds: [COMMAND_EMBED] });
    } catch (err) {
      console.warn('[Command | LastSeen] An error occurred:', err);
    }
  },
};

export default LAST_SEEN;
