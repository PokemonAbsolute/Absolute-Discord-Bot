import { SlashCommandBuilder } from '@discordjs/builders';
import { EmbedBuilder } from 'discord.js';

import { getPlayerbyAuthCode } from '../util/get-player-by-auth-code';
import { connectDiscordAccount } from '../util/connect-discord-account';

import { CommandInterface } from '../types/command';

const CONNECT: CommandInterface = {
    name: 'connect',
    description: 'Connects your Discord account to your Pokemon Absolute RPG account.',
    developerOnly: false,
    ownerOnly: false,

    data: new SlashCommandBuilder()
        .setName('connect')
        .setDescription('Connects your Discord account to your Pok&eacute;mon Absolute RPG account.')
        .addUserOption((option) =>
            option.setName('auth_code').setDescription("Authentication code of the player's account").setRequired(true)
        ),

    run: async (interaction): Promise<void> => {
        try {
            await interaction.deferReply();

            const AUTH_CODE = interaction.options.get('auth_code') as unknown;

            const PLAYER_DATA = await getPlayerbyAuthCode(AUTH_CODE as string);

            let COMMAND_EMBED: EmbedBuilder;

            if (typeof PLAYER_DATA === 'undefined') {
                COMMAND_EMBED = new EmbedBuilder()
                    .setTitle('Command Error')
                    .addFields({
                        name: 'Description',
                        value: `Unable to find the user corresponding to the entered auth code.`,
                    })
                    .setColor('#FF0000')
                    .setTimestamp();
            } else {
                const CONNECTION_RESPONSE = await connectDiscordAccount(
                    interaction.user.id,
                    interaction.user.tag,
                    AUTH_CODE as string
                );

                COMMAND_EMBED = new EmbedBuilder()
                    .setTitle('Account Connected')
                    .setDescription(`Your account is connected to the RPG account ${CONNECTION_RESPONSE.Username}.`)
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
