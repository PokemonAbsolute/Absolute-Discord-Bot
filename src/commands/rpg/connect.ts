import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

import { CommandInterface, CommandOptionData } from '../../types/command';

import { getPlayerbyAuthCode } from '../../util/get-player-by-auth-code';
import { connectDiscordAccount } from '../../util/connect-discord-account';

const CONNECT: CommandInterface = {
    name: 'connect',
    description: 'Connects your Discord account to your Pokemon Absolute RPG account.',

    category: 'rpg',
    cooldown: 0,

    permissions: [],

    developerOnly: false,
    ownerOnly: false,

    data: new SlashCommandBuilder()
        .setName('connect')
        .setDescription('Connects your Discord account to your Pokemon Absolute RPG account.')
        .addStringOption((option) => {
            return option
                .setName('authcode')
                .setDescription("Authentication code of the player's account")
                .setRequired(true);
        }),

    execute: async (interaction): Promise<void> => {
        try {
            await interaction.deferReply();

            const AUTH_CODE = interaction.options.get('authcode') as unknown as CommandOptionData;

            const PLAYER_DATA = await getPlayerbyAuthCode(AUTH_CODE.value);

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
                    AUTH_CODE.value
                );

                COMMAND_EMBED = new EmbedBuilder()
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
