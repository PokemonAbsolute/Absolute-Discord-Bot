import { lastSeenOn } from '../util/last-seen';

import { SlashCommandBuilder } from '@discordjs/builders';
import { EmbedBuilder } from 'discord.js';

import { CommandInterface } from '../types/command';
import MySQL from '../classes/mysql';

const LAST_SEEN: CommandInterface = {
    name: 'lastseen',
    description: 'Fetches the time that the specified user was last seen on.',
    developerOnly: false,
    ownerOnly: false,

    data: new SlashCommandBuilder()
        .setName('lastseen')
        .setDescription('Fetches the time that the specified user was last seen on.')
        .addStringOption((option) => {
            return option
                .setName('user')
                .setDescription('Username or user ID of the player.')
                .setRequired(true);
        }),

    run: async (interaction): Promise<void> => {
        try {
            await interaction.deferReply();

            const USER_OPTION = interaction.options.get('user', true);

            const USER_DATA_QUERY = await MySQL.doQuery(
                'SELECT `Username`, `Last_Active` FROM `users` WHERE UPPER(`Username`) = UPPER(?) OR `ID` = ? LIMIT 1',
                [USER_OPTION, USER_OPTION]
            );

            let COMMAND_EMBED: EmbedBuilder;

            if (typeof USER_DATA_QUERY === 'undefined') {
                COMMAND_EMBED = new EmbedBuilder()
                    .setTitle('Command Error')
                    .addFields({
                        name: 'Description',
                        value: `Unable to find user data for ${USER_OPTION}.`,
                    })
                    .setColor('#FF0000')
                    .setTimestamp();

                return;
            }

            const USER_DATA: { Username: string; Last_Active: number } = USER_DATA_QUERY[0];

            COMMAND_EMBED = new EmbedBuilder()
                .setTitle('Last Seen')
                .addFields(
                    { name: 'User', value: USER_DATA.Username ?? 'Unknown User' },
                    {
                        name: 'Last Seen',
                        value: lastSeenOn(USER_DATA.Last_Active ?? 0),
                    }
                )
                .setColor('#4a618f')
                .setTimestamp();

            await interaction.editReply({ embeds: [COMMAND_EMBED] });
        } catch (err) {
            console.warn('[Command | LastSeen] An error occurred:', err);
        }
    },
};

export default LAST_SEEN;
